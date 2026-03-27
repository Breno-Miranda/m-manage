import { Elysia, t } from 'elysia';
import { mLead } from '../models/mLeads';
import { mLogs } from '../models/mLogs';

const createLeadBody = t.Object({
    name: t.String({ minLength: 2, maxLength: 120 }),
    email: t.String({ format: 'email', maxLength: 180 }),
    phone: t.String({ minLength: 8, maxLength: 30 }),
    company: t.Optional(t.String({ maxLength: 180 })),
    service: t.String({ minLength: 2, maxLength: 120 }),
    budget: t.Optional(t.String({ maxLength: 80 })),
    message: t.String({ minLength: 10, maxLength: 3000 }),
    source: t.Optional(t.String({ maxLength: 120 }))
});

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error && error.message) return error.message;
    return 'Erro interno ao processar lead';
};

export const leadRoutes = new Elysia({ prefix: '/leads' })
    .post('/', async ({ body, set }) => {
        try {
            const lead = await mLead.create({
                ...body,
                source: body.source || 'website:expertise',
                status: 'new'
            });

            try {
                await mLogs.create({
                    action: 'CREATE_LEAD',
                    details: `New lead created from ${lead.source} - ${lead.email}`,
                    user: lead.email,
                    level: 'info'
                });
            } catch {
                // Logging must not block lead capture
            }

            set.status = 201;
            return {
                success: true,
                message: 'Lead registrado com sucesso',
                data: {
                    id: String(lead._id),
                    status: lead.status
                }
            };
        } catch (error: unknown) {
            set.status = 500;
            return {
                success: false,
                error: getErrorMessage(error)
            };
        }
    }, {
        body: createLeadBody
    })
    .get('/', async ({ set }) => {
        try {
            const leads = await mLead.find().sort({ createdAt: -1 }).limit(200);
            return {
                success: true,
                count: leads.length,
                data: leads
            };
        } catch (error: unknown) {
            set.status = 500;
            return {
                success: false,
                error: getErrorMessage(error)
            };
        }
    });
