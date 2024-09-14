export default function getTimestampFromObjectId(objectId: string) {
  // Extract the first 8 characters (representing the timestamp)
  const timestampHex = objectId.substring(0, 8);

  // Convert hex string to a decimal number
  const timestamp = parseInt(timestampHex, 16);

  // Convert the timestamp to milliseconds and create a Date object
  const date = new Date(timestamp * 1000);

  return date.toISOString().split("T")[0].replaceAll("-", "/");
}
