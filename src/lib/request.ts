import https from 'https';

export async function get(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let rs = '';
      res.on('data', (d) => rs += d);
      res.on('end', () => {
        try {
          rs = JSON.parse(rs);
        } catch (e) {}

        resolve(rs);
      });
    }).on('error', reject);
  });
}

export default {
  get,
};
