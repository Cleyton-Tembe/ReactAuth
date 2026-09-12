export default function generateVerificationCode(): string {
  return Math.floor(1000 + Math.random() * 900000).toString();
}
