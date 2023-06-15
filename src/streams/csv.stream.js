import { parse } from 'csv-parse';

class CsvStream {
  #parser

  constructor({
    handleCsvLine,
  }) {
    const parser = parse({
      delimiter: ',',
      skip_records_with_error: true,
    });

    parser.on('readable', async function () {
      let record;

      while ((record = parser.read()) !== null) {
        const [title, description] = record;

        await handleCsvLine({ title, description });
      }
    });

    parser.on('error', function(err) {
      console.error('Error CSV Line:', err.message);
    });

    this.#parser = parser;
  }

  write(file) {
    this.#parser.write(file);
    this.#parser.end();
  }
}

export { CsvStream };
