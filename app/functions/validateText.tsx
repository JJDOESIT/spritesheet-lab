"use server";

export default async function validateText(
  text: string,
  min: number,
  max: number
) {
  return text.length > min && text.length <= max;
}
