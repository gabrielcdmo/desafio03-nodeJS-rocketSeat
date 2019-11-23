import { Router } from 'express';

import SessionsController from './app/controllers/SessionsController';
import StudentController from './app/controllers/StudentController';
import AdminController from './app/controllers/AdminController';
import registersController from './app/controllers/registersController';

import authMiddleware from './app/middlewares/auth';


const routes = Router();

//----------------------------------[         CHEKIN/CHAMADOS        ]---------------------------------------

//[Fazer chekin] 
routes.post('/students/:id/chekin', registersController.store);

//[Verificar chekin's (admin)]
routes.post('/students/chekins', registersController.index);

//[Solicitar chamado] 
routes.post('/students/:id/help-orders', registersController.request);

//[Verificar todos chamados (admin)] 
routes.get('/students/calls', authMiddleware, registersController.listRequest);

//[Verificar chamados de um estudante (admin)] 
routes.get('/students/:id/calls', authMiddleware, registersController.listRequestOne);

//[Responder um chamado (admin)] 
routes.post('/students/:id/answerCall', authMiddleware, registersController.answerCall);

//----------------------------------[       MATRÍCULA/ESTUDANTE        ]---------------------------------------
  
//[Logar como admin]
routes.post('/login', SessionsController.store);  

//[Middleware de verificação do token] 
routes.use(authMiddleware);   

//[Criar/Editar um estudante]                                                                     
routes.post('/criar', StudentController.create);                                                
routes.post('/editar', StudentController.update);      

//[Criar uma nova matrícula]                                                                    
routes.post('/matricula', AdminController.createRegistration);        

//[Listar matrículas]                                                                             
routes.get('/matricula', AdminController.listRegistration);     
//[Editar matrícula]                                    
routes.put('/matricula', AdminController.attRegistration);   

//[Deletar matrícula]                                                                        
routes.post('/matricula/:id', AdminController.delRegistration);    




export default routes;