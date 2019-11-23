//--[Models]------------------------------
import Students from '../models/students';
import plans from '../models/plans';
import Registration from '../models/registrations';

//--[Bibliotecas]------------------------------
import { format, addMonths } from 'date-fns';
import pt from 'date-fns/locale/pt';

//--[Lib]------------------------------
import Mail from '../../lib/Mail';

import * as Yup from 'yup';

class AdminController
{
    //--Criando uma nova matrícula
    async createRegistration(req, res)
    {
        const schema = Yup.object().shape({
            student_id: Yup.string().required(), 
            plan_id: Yup.string().required(), 
        });

        if (!(await schema.isValid(req.body)))
        {
            return res.status(401).json({ error: 'Schema is not valid' });
        }

        const { student_id, plan_id } = req.body;
        const student = await Students.findByPk(student_id);
        if(!student)
        {
            return res.status(401).json({ error: 'Student does exits'});
        }
        const registerExists = await Registration.findOne({ where: { student_id: student_id }})
        if(registerExists)
        {
            return res.status(401).json({ error: 'Student already has registration'});
        };

        const plan = await plans.findByPk(plan_id);
        if(!plan)
        {
            return res.status(401).json({ error: 'Plan does exists'}); 
        }

        const start_date = new Date();
        const end_date = addMonths(start_date, plan.duration)
        const price = plan.price * plan.duration;

         const registerM = await Registration.create({
             start_date,
             end_date,
              price,
             student_id,
             plan_id, 
         });

         const initDateFormat = format(
             start_date, 
             "'dia' dd 'de' MMMM' de 'yyyy",
             { locale: pt }
         );

         const endDateFormat = format(
             end_date, 
             "'dia' dd 'de' MMMM' de 'yyyy",
             { locale: pt }
         );

        await Mail.sendMail({
            to: `${student.name}, <${student.email}>`,
            subject: 'Sua nova matrícula!',
            template: 'register',
            context: {
                plan: plan.title,
                init: initDateFormat,
                end: endDateFormat,
                price_monthly: plan.price, 
                price: price,
            }
        })
        
        return res.json(registerM);
    }

    //--Listando matrículas
    async listRegistration(req, res)
    {
        const register = await Registration.findAll({
            attributes: ['id', 'start_date', 'end_date'],
            include: 
            [   
                {
                    model: Students,
                    attributes: ['name', 'email', 'idade']
                },
                {
                    model: plans,
                    attributes: ['title', 'duration', 'price']
                }
            ]
        });

        return res.json(register);
    }

    //--Atualizando matrículas 
    async attRegistration(req, res)
    {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(), 
            plan_id: Yup.string().required(),
        });
        if (!(await schema.isValid(req.body)))
        {
            return res.status(401).json({ error: 'Schema is not valid' });
        }

        const { email, plan_id } = req.body;
        const student = await Students.findOne({ where: {email: email}})
        if(!student)
        {
            return res.status(401).json({ error: 'Student does not exists'})
        }

        const register = await Registration.findOne({ where: { student_id: student.id }});
        if(!register)
        {
            return res.status(401).json({ error: 'Student not have registration'});
        }

        const plan = await plans.findByPk(plan_id)
        if(!plan)
        {
            return res.status(401).json({ error: 'Plan ID is not valid'});  
        }

        const date = new Date();
        const end_date = addMonths(date, plan.duration);

        register.update({
            plan_id: plan_id,  
            end_date: end_date
        });

        return res.json(register);
    }

    //--Removendo plano
    async delRegistration(req, res)
    {
        const { id } = req.params;
        const student = await Registration.destroy({ where: { student_id: id }});
        if(student == 0)
        {
            return res.json({ Message: 'Register does not exists' });
        }
        return res.json({ Message: 'Register deleted' });
    }
}

export default new AdminController();