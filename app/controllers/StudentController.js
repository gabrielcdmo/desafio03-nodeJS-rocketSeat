import * as Yup from 'yup';
import Students from '../models/students';
import User from '../models/user';

class StudentController
{
    async create(req, res)
    {
        const user = await User.findByPk(req.userId);
        if(!user)
        {
            return res.status(401).json({ error: 'Account does not exists' });
        }

        const schema = Yup.object().shape({
            name: Yup.string().required(), 
            email: Yup.string().email(),
            idade: Yup.string().required(),
            altura: Yup.string().required(),
        });
        if(!(await schema.isValid(req.body)))
        {
            return res.status(401).json({ error: 'Validations fails'});
        }

        const userExists = await Students.findOne({where: {email: req.body.email}});
        if(userExists)
        {
            return res.status(401).json({ message: 'The user already exists'})
        }

        const { id, name, email } = await Students.create(req.body);
        return res.json({
            id, 
            name,
            email
        });
    }

    async update(req, res)
    {
        const user = await User.findByPk(req.userId);
        if(!user)
        {
            return res.status(401).json({ error: 'Account does not exists' });
        }

        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().required().email(),
            idade: Yup.string(),
            altura: Yup.string(),
        });

        if(!(await schema.isValid(req.body)))
        {
            return res.status(401).json({ error: 'Validations fails'})
        }

        const students = await Students.findOne({ where: { email: req.body.email } });
        if (!students)
        {
            return res.json({ error: 'User does not exists' });
        }
        const { name, email, idade, altura } = await students.update(req.body);
        return res.json({
            name, 
            email, 
            idade, 
            altura
        });        
    }
}

export default new StudentController();