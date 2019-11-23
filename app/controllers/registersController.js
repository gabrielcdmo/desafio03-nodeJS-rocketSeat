import Students from '../models/students';
import Chekins from '../models/chekins';
import * as Yup from 'yup';
import HelpOrder from '../models/helpOrder';
import Mail from '../../lib/Mail';
import pt from 'date-fns/locale/pt';
import { format } from 'date-fns';

class registersController {
    //Realizando chekin ao chegar na faculdade
    async store(req, res)
    {
        const { id } = req.params;
        const student = await Students.findByPk(id);
        if(!student)
        {
            return res.status(401).json({ error: 'Student does not exists' });
        }

        const { count } = await Chekins.findAndCountAll({ where:  { student_id: id }});
        if (count > 5)
        {
            return res.status(401).json({ error: 'You have you ever made the most of chekins'});
        }
        
        const chekins = await Chekins.create({ student_id: id });

        return res.json(chekins);
    }

    //Admins listando chekins de determinado aluno
    async index(req, res)
    {
        const { id } = req.params;
        const chekins = await Chekins.findAll({ 
            where: { student_id: id },
            attributes: ['createdAt'],
            include: 
            [
                {
                    model: Students,
                    attributes: ['name', 'email']
                }
            ]
        })

        return res.json(chekins);
    }

    //Aluno solicitando auxilio
    async request(req, res)
    {
        const schema = Yup.object().shape({
            question: Yup.string().required()
        });
        if(!(await schema.isValid(req.body)))
        {
            return res.status(401).json({ error: 'Schema is not valid'});
        }

        const { id } = req.params;
        const { question } = req.body;

        const student = await Students.findByPk(id)
        if(!student)
        {
            return res.status(401).json({ error: 'Student does not exists' });
        };

        const help_order = await HelpOrder.create({
            student_id: id, 
            question: question
        });

        return res.json(help_order);
    }

    //Admins listando todos chamados não lidos
    async listRequest(req, res)
    {
        const helporder = await HelpOrder.findAll({ where: { answer: null } });
        if(!helporder)
        {
            return res.status(401).json({ error: 'There are no calls'});
        }
        return res.json(helporder);
    }

    //Admins listando chamados não lidos de um estudante
    async listRequestOne(req, res)
    {
        const { id } = req.params;
        const helporder = await HelpOrder.findAll({ where: { student_id: id, answer: null } });
        if(!helporder)
        {
            return res.status(401).json( { error: 'The student dont have calls' } );
        }

        return res.json(helporder);
    }

    async answerCall(req, res)
    {
        const { id } = req.params;
        const helporder = await HelpOrder.findByPk(id);
        if(!helporder)
        {
            return res.status(401).json( { error: 'Call is not find'} )
        }

        const schema = Yup.object().shape({
            result: Yup.string().required()
        });
        if(!(await schema.isValid(req.body)))
        {
            return res.status(401).json({ error: 'Schema is not valid'});
        }

        const { result } = req.body;
        const dateCall = new Date();
        const orderAtt = await helporder.update({
            answer: result,
            answer_at: dateCall
        });

        const dateFormated = format(
            dateCall, 
            "'dia' dd 'de' MMMM', ás ' H:mm'h'", 
            { locale: pt }
        );
        
        const student = await Students.findByPk(helporder.student_id);
        
        await Mail.sendMail({
           to: `${student.name}, <${student.email}>`,
           subject: 'Resposta recebida!',
           template: 'answer',
           context: {
               question: helporder.question,
               result: result, 
               date: dateFormated
           }
        })

        return res.json(orderAtt);
    }
}

export default new registersController();
