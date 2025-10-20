declare module 'bcryptjs' {
  const hash: (data: string, saltOrRounds: string | number) => Promise<string>;
  const compare: (data: string, encrypted: string) => Promise<boolean>;
  const genSalt: (rounds?: number) => Promise<string>;
  export default { hash, compare, genSalt };
}
