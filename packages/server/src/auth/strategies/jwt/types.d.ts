/**
 * The payload object that was signed and sent in the JWT.
 */
export type JwtPayload = {
  /**
   * The user's email address.
   */
  email: string;
  /**
   * The user's id (assigned by MongoDB).
   */
  sub: string;
};
