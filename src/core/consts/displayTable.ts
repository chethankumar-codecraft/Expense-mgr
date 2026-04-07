export function displayTable<T extends Record<string, any>>(
  data: T[],
  fields?: (keyof T)[],
) {
  if (!data.length) {
    console.log("No data found");
    return;
  }

  // 👇 if fields not provided → take all keys from first object
  const finalFields =
    fields && fields.length ? fields : (Object.keys(data[0]!) as (keyof T)[]);

  // Add index column at start
  const headers = ["#", ...finalFields.map((f) => String(f))];

  const rows = data.map((item, idx) => [
    String(idx + 1),
    ...finalFields.map((field) => {
      const value = item[field] ?? null;
      return value === null || value === "" ? "-" : String(value);
    }),
  ]);

  const colWidths = headers.map((header, i) =>
    Math.max(header.length, ...rows.map((row) => row[i]!.length)),
  );

  const pad = (str: string, width: number) =>
    str + " ".repeat(width - str.length + 1);

  const createBorder = () =>
    "+" + colWidths.map((w) => "-".repeat(w + 2)).join("+") + "+";

  const printRow = (row: string[]) => {
    console.log(
      "|" +
        row.map((cell, i) => " " + pad(cell, colWidths[i]!)).join("|") +
        "|",
    );
  };

  console.log("\n\n", createBorder());
  printRow(headers);
  console.log(createBorder());
  rows.forEach(printRow);
  console.log(createBorder());
  console.log("\n\n");
}
