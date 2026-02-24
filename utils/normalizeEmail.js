// copied from https://github.com/Quiet-Terminal-Interactive/QTIAuth/blob/main/src/lib.js

export default (email) => {
  if (!email || !email?.match(/^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*$/i)) return null;

  email = email.toLowerCase().trim();

  // Gmail ignores dots and everything after "+" in the local part.
  if (email.endsWith('@gmail.com')) {
    const [local] = email.split('@');
    const cleaned = local.replace(/\./g, '').split('+')[0];
    return `${cleaned}@gmail.com`;
  }

  const [local, domain] = email.split('@');
  return `${local.split('+')[0]}@${domain}`;
}