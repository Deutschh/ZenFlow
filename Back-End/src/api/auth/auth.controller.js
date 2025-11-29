// Em: src/api/auth/auth.controller.js

const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. IMPORTAMOS NOSSO NOVO SERVIÇO DE EMAIL
const { sendWelcomeEmail } = require('../../services/email.service')

// --- REGISTRO DE USUÁRIO (COM LÓGICA CORRIGIDA) ---
exports.registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    businessName,
    businessType,
    cep,
    phone
  } = req.body;

  const fullName = `${firstName} ${lastName}`;

  if (!firstName || !lastName || !email || !password || !businessName || !businessType || !cep || !phone) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  let newUser; // 1. Declaramos newUser aqui fora

  // --- Bloco Try/Catch SOMENTE para o Banco de Dados (Crítico) ---
  try {
    await db.query('BEGIN');

    // Criar a organização
    const orgQuery = `
      INSERT INTO organizations(name, business_type, cep, phone) 
      VALUES($1, $2, $3, $4) 
      RETURNING id

    `;
    const orgResult = await db.query(orgQuery, [
      businessName,
      businessType,
      cep,
      phone
    ]);
    const organizationId = orgResult.rows[0].id;

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Criar o usuário
    const userQuery = `
      INSERT INTO users(organization_id, name, email, password_hash, role) 
      VALUES($1, $2, $3, $4, $5) 
      RETURNING id, email, name, role
    `;
    const userResult = await db.query(userQuery, [
      organizationId,
      fullName,
      email,
      passwordHash,
      'owner'
    ]);
    
    newUser = userResult.rows[0]; // 2. Atribuímos o valor a newUser

    // Confirma a transação
    await db.query('COMMIT'); // <-- O usuário está 100% salvo aqui.

  } catch (error) {
    // Se QUALQUER COISA do banco de dados falhar, nós desfazemos
    await db.query('ROLLBACK');
    console.error('Erro no registro (Banco de Dados):', error);

    if (error.code === '23505') { // Erro de e-mail duplicado
      return res.status(409).json({ error: 'Este e-mail já está em uso.' });
    }
    
    // Envia o erro de "Erro interno"
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }

  // --- SUCESSO! ---
  // Se o código chegou aqui, o 'try' do banco de dados foi um sucesso.

  try {
    // 1. Responde ao Frontend IMEDIATAMENTE.
    // O frontend agora vai rodar o navigate("/planos")
    res.status(201).json({
      message: 'Organização e usuário criados com sucesso!',
      user: newUser,
    });
    
    // 2. DEPOIS de responder, nós tentamos enviar o email.
    // (Removemos o 'await' para ser "dispare e esqueça")
    // Se isso falhar, o usuário não verá um erro, pois ele já recebeu a resposta 201.
    // O erro será logado apenas aqui no backend (pelo email.service.js)
    sendWelcomeEmail(newUser.email, firstName);

  } catch (responseError) {
      // Este catch é só para o caso de 'res.status(201).json' falhar
      // (o que é quase impossível, mas é uma boa prática)
      console.error("Erro ao enviar resposta de sucesso:", responseError);
  }
};

// --- LOGIN DE USUÁRIO ---
// (Não precisa de nenhuma alteração. Está perfeito.)
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  try {
    // 1. Encontrar o usuário
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await db.query(userQuery, [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 2. Comparar a senha
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 3. Criar o Token JWT (o "crachá")
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organization_id, // MUITO IMPORTANTE!
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expira em 1 dia
    );

    res.status(200).json({
      message: 'Login realizado com sucesso!',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    // O middleware 'checkAuth' já validou a assinatura do token e colocou o ID em req.userData.
    // Agora, vamos garantir que o usuário não foi deletado do banco.
    
    const { userId } = req.userData;
    
    const userQuery = 'SELECT id, name, email, role FROM users WHERE id = $1';
    const { rows } = await db.query(userQuery, [userId]);
    const user = rows[0];

    if (!user) {
      // Token é válido criptograficamente, mas o usuário não existe mais (foi deletado)
      return res.status(404).json({ valid: false, error: 'Usuário não encontrado.' });
    }

    // Tudo certo!
    res.status(200).json({ valid: true, user: user });

  } catch (error) {
    console.error('Erro na verificação:', error);
    res.status(500).json({ error: 'Erro interno.' });
  }
};