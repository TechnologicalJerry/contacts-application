import { Request, Response } from "express";
import {
  CreateContactInput,
  UpdateContactInput,
} from "../schema/contact.schema";
import {
  createContact,
  deleteContact,
  findAndCountContacts,
  findAndUpdateContact,
  findContact,
} from "../service/contact.service";

export async function createContactHandler(
  req: Request<{}, {}, CreateContactInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const body = req.body;

  const contact = await createContact({ ...body, user: userId });

  return res.status(201).send(contact);
}

export async function getContactsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const q = req.query.q as string | undefined;
  const category = req.query.category as string | undefined;
  const favorite = req.query.favorite !== undefined
    ? req.query.favorite === "true"
    : undefined;
  const sortBy = req.query.sortBy as string | undefined;
  const sortOrder = req.query.sortOrder as "asc" | "desc" | undefined;

  const result = await findAndCountContacts({
    userId,
    page,
    limit,
    q,
    category,
    favorite,
    sortBy,
    sortOrder,
  });

  return res.send(result);
}

export async function getContactHandler(
  req: Request<UpdateContactInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const contactId = req.params.contactId;

  const contact = await findContact({ contactId, user: userId });

  if (!contact) {
    return res.status(404).send({ error: "Contact not found" });
  }

  return res.send(contact);
}

export async function updateContactHandler(
  req: Request<UpdateContactInput["params"], {}, UpdateContactInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const contactId = req.params.contactId;
  const update = req.body;

  const contact = await findContact({ contactId, user: userId });

  if (!contact) {
    return res.status(404).send({ error: "Contact not found" });
  }

  const updatedContact = await findAndUpdateContact(
    { contactId, user: userId },
    update,
    { new: true }
  );

  return res.send(updatedContact);
}

export async function deleteContactHandler(
  req: Request<UpdateContactInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const contactId = req.params.contactId;

  const contact = await findContact({ contactId, user: userId });

  if (!contact) {
    return res.status(404).send({ error: "Contact not found" });
  }

  await deleteContact({ contactId, user: userId });

  return res.send({ message: "Contact deleted successfully" });
}
