// src/api/subscription/subscription.controller.js
const db = require('../../config/database');

exports.selectPlan = async (req, res) => {
  const { plan } = req.body; // Esperamos receber { plan: 'starter' | 'pro' | 'enterprise' }
  const { organizationId } = req.userData; // Vem do token (middleware)

  if (!['starter', 'pro', 'enterprise'].includes(plan)) {
    return res.status(400).json({ error: 'Plano inválido.' });
  }

  try {
    // Atualiza o plano da organização no banco
    // Definimos status como 'active' por padrão para este teste
    const query = `
      UPDATE organizations 
      SET plan = $1, subscription_status = 'active' 
      WHERE id = $2
      RETURNING *
    `;
    
    const { rows } = await db.query(query, [plan, organizationId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Organização não encontrada.' });
    }

    res.status(200).json({
      message: `Plano atualizado para ${plan} com sucesso!`,
      organization: rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar plano:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};