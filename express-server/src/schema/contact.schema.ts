import { object, string, boolean, array, TypeOf, number } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     ContactInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *       properties:
 *         firstName:
 *           type: string
 *           default: "Jane"
 *         lastName:
 *           type: string
 *           default: "Doe"
 *         email:
 *           type: string
 *           default: "jane.doe@example.com"
 *         phone:
 *           type: string
 *           default: "+1-555-0199"
 *         company:
 *           type: string
 *           default: "Acme Corp"
 *         jobTitle:
 *           type: string
 *           default: "Software Engineer"
 *         address:
 *           type: string
 *           default: "123 Tech Lane, Silicon Valley, CA"
 *         category:
 *           type: string
 *           default: "Work"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           default: ["colleague", "engineering"]
 *         avatar:
 *           type: string
 *           default: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
 *         notes:
 *           type: string
 *           default: "Key contact for project Alpha"
 *         favorite:
 *           type: boolean
 *           default: false
 *     ContactResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         contactId:
 *           type: string
 *         user:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         company:
 *           type: string
 *         jobTitle:
 *           type: string
 *         address:
 *           type: string
 *         category:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         avatar:
 *           type: string
 *         notes:
 *           type: string
 *         favorite:
 *           type: boolean
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *     PaginatedContactResponse:
 *       type: object
 *       properties:
 *         contacts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ContactResponse'
 *         total:
 *           type: number
 *         page:
 *           type: number
 *         limit:
 *           type: number
 *         totalPages:
 *           type: number
 */

const payload = {
  body: object({
    firstName: string({
      required_error: "First name is required",
    }).min(1, "First name cannot be empty"),
    lastName: string({
      required_error: "Last name is required",
    }).min(1, "Last name cannot be empty"),
    email: string().email("Not a valid email").optional().or(string().length(0)),
    phone: string().optional(),
    company: string().optional(),
    jobTitle: string().optional(),
    address: string().optional(),
    category: string().optional(),
    tags: array(string()).optional(),
    avatar: string().optional(),
    notes: string().optional(),
    favorite: boolean().optional(),
  }),
};

const updatePayload = {
  body: object({
    firstName: string().min(1, "First name cannot be empty").optional(),
    lastName: string().min(1, "Last name cannot be empty").optional(),
    email: string().email("Not a valid email").optional().or(string().length(0)),
    phone: string().optional(),
    company: string().optional(),
    jobTitle: string().optional(),
    address: string().optional(),
    category: string().optional(),
    tags: array(string()).optional(),
    avatar: string().optional(),
    notes: string().optional(),
    favorite: boolean().optional(),
  }),
};

const params = {
  params: object({
    contactId: string({
      required_error: "contactId is required",
    }),
  }),
};

export const createContactSchema = object({
  ...payload,
});

export const updateContactSchema = object({
  ...updatePayload,
  ...params,
});

export const deleteContactSchema = object({
  ...params,
});

export const getContactSchema = object({
  ...params,
});

export type CreateContactInput = TypeOf<typeof createContactSchema>;
export type UpdateContactInput = TypeOf<typeof updateContactSchema>;
export type ReadContactInput = TypeOf<typeof getContactSchema>;
export type DeleteContactInput = TypeOf<typeof deleteContactSchema>;
