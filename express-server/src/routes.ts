import { Express, Request, Response } from "express";
import {
  createContactHandler,
  getContactHandler,
  getContactsHandler,
  updateContactHandler,
  deleteContactHandler,
} from "./controller/contact.controller";
import {
  createUserSessionHandler,
  getUserSessionsHandler,
  deleteSessionHandler,
} from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import validateResource from "./middleware/validateResource";
import {
  createContactSchema,
  deleteContactSchema,
  getContactSchema,
  updateContactSchema,
} from "./schema/contact.schema";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchema } from "./schema/user.schema";

function routes(app: Express) {
  /**
   * @openapi
   * /healthcheck:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  /**
   * @openapi
   * '/api/users':
   *  post:
   *     tags:
   *     - User
   *     summary: Register a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateUserInput'
   *     responses:
   *      201:
   *        description: User created
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateUserResponse'
   *      409:
   *        description: User already exists
   *      400:
   *        description: Bad request
   */
  app.post("/api/users", validateResource(createUserSchema), createUserHandler);

  /**
   * @openapi
   * '/api/sessions':
   *  get:
   *    tags:
   *    - Session
   *    summary: Get all sessions
   *    responses:
   *      200:
   *        description: Get all active sessions for current user
   *      403:
   *        description: Forbidden
   *  post:
   *    tags:
   *    - Session
   *    summary: Create a session (Login)
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateSessionInput'
   *    responses:
   *      200:
   *        description: Session created with accessToken & refreshToken
   *      401:
   *        description: Unauthorized
   *  delete:
   *    tags:
   *    - Session
   *    summary: Delete a session (Logout)
   *    responses:
   *      200:
   *        description: Session invalidated
   *      403:
   *        description: Forbidden
   */
  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createUserSessionHandler
  );

  app.get("/api/sessions", requireUser, getUserSessionsHandler);

  app.delete("/api/sessions", requireUser, deleteSessionHandler);

  /**
   * @openapi
   * '/api/contacts':
   *  post:
   *     tags:
   *     - Contacts
   *     summary: Create a new contact
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ContactInput'
   *     responses:
   *       201:
   *         description: Contact created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ContactResponse'
   *       401:
   *         description: Unauthorized
   *  get:
   *     tags:
   *     - Contacts
   *     summary: List contacts with search and pagination
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: page
   *         in: query
   *         description: Page number
   *         required: false
   *         schema:
   *           type: integer
   *           default: 1
   *       - name: limit
   *         in: query
   *         description: Number of items per page
   *         required: false
   *         schema:
   *           type: integer
   *           default: 10
   *       - name: q
   *         in: query
   *         description: Search term across name, email, phone, company
   *         required: false
   *         schema:
   *           type: string
   *       - name: category
   *         in: query
   *         description: Filter by contact category
   *         required: false
   *         schema:
   *           type: string
   *       - name: favorite
   *         in: query
   *         description: Filter by favorite status
   *         required: false
   *         schema:
   *           type: boolean
   *     responses:
   *       200:
   *         description: List of contacts with total counts
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedContactResponse'
   */
  app.post(
    "/api/contacts",
    [requireUser, validateResource(createContactSchema)],
    createContactHandler
  );

  app.get("/api/contacts", requireUser, getContactsHandler);

  /**
   * @openapi
   * '/api/contacts/{contactId}':
   *  get:
   *     tags:
   *     - Contacts
   *     summary: Get a single contact by contactId
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *      - name: contactId
   *        in: path
   *        description: Unique contact ID
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ContactResponse'
   *       404:
   *         description: Contact not found
   *  put:
   *     tags:
   *     - Contacts
   *     summary: Update a contact
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *      - name: contactId
   *        in: path
   *        description: Unique contact ID
   *        required: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ContactInput'
   *     responses:
   *       200:
   *         description: Contact updated successfully
   *       404:
   *         description: Contact not found
   *  delete:
   *     tags:
   *     - Contacts
   *     summary: Delete a contact
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *      - name: contactId
   *        in: path
   *        description: Unique contact ID
   *        required: true
   *     responses:
   *       200:
   *         description: Contact deleted successfully
   *       404:
   *         description: Contact not found
   */
  app.get(
    "/api/contacts/:contactId",
    [requireUser, validateResource(getContactSchema)],
    getContactHandler
  );

  app.put(
    "/api/contacts/:contactId",
    [requireUser, validateResource(updateContactSchema)],
    updateContactHandler
  );

  app.delete(
    "/api/contacts/:contactId",
    [requireUser, validateResource(deleteContactSchema)],
    deleteContactHandler
  );
}

export default routes;
