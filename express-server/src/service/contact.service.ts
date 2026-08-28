import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ContactModel, {
  ContactDocument,
  ContactInput,
} from "../models/contact.model";

export async function createContact(input: ContactInput) {
  return ContactModel.create(input);
}

export async function findContact(
  query: FilterQuery<ContactDocument>,
  options: QueryOptions = { lean: true }
) {
  return ContactModel.findOne(query, null, options);
}

export interface ListContactsOptions {
  userId: string;
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  favorite?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function findAndCountContacts(options: ListContactsOptions) {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 10));
  const skip = (page - 1) * limit;

  const filter: FilterQuery<ContactDocument> = { user: options.userId };

  if (options.category) {
    filter.category = options.category;
  }

  if (options.favorite !== undefined) {
    filter.favorite = options.favorite;
  }

  if (options.q && options.q.trim().length > 0) {
    const searchRegex = new RegExp(options.q.trim(), "i");
    filter.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { company: searchRegex },
      { jobTitle: searchRegex },
      { tags: searchRegex },
    ];
  }

  const sortField = options.sortBy || "createdAt";
  const sortDirection = options.sortOrder === "asc" ? 1 : -1;
  const sortOption: Record<string, 1 | -1> = { [sortField]: sortDirection };

  const [contacts, total] = await Promise.all([
    ContactModel.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
    ContactModel.countDocuments(filter),
  ]);

  return {
    contacts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function findAndUpdateContact(
  query: FilterQuery<ContactDocument>,
  update: UpdateQuery<ContactDocument>,
  options: QueryOptions
) {
  return ContactModel.findOneAndUpdate(query, update, options);
}

export async function deleteContact(query: FilterQuery<ContactDocument>) {
  return ContactModel.deleteOne(query);
}
