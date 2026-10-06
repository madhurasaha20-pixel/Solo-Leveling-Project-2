/**
 * A bank customer, as returned by the API.
 * The password is never part of this shape.
 * See core/contracts/CONTRACTS.md.
 */
export interface User {
  id: string;        // e.g. "u1"
  name: string;
  email: string;
  createdAt: string; // ISO 8601
}
