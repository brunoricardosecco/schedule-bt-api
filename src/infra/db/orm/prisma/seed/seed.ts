import fs from "fs"
import { join } from "path"
import { db } from '../index'

async function main() {
  const queries = fs
    .readFileSync(join(__dirname, "seed.sql"))
    .toString()
    .split("\n")
    .filter((line) => line.indexOf("--") !== 0) // ignore comments
    .join("\n")
    .replace(/(\r\n|\n|\r)/gm, " ") // remove newlines
    .replace(/\s+/g, " ") // excess white space
    .split(";")
    
  for (const query of queries) {
    console.log(query)
    await db.$queryRawUnsafe(query)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })