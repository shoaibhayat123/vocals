import { hash, compare } from 'bcrypt';
import { CONFIG } from '../models/constants';

//const SALT_ROUNDS = CONFIG.BCRYPT_SALT_ROUNDS;
/*
https://security.stackexchange.com/questions/17207/recommended-of-rounds-for-bcrypt

1/23/2014  Intel Core i7-2700K CPU @ 3.50 GHz

| Cost | Iterations        |    Duration |
|------|-------------------|-------------|
|  8   |    256 iterations |     38.2 ms | <-- minimum allowed by BCrypt
|  9   |    512 iterations |     74.8 ms |
| 10   |  1,024 iterations |    152.4 ms | <-- current default (BCRYPT_COST=10)
| 11   |  2,048 iterations |    296.6 ms |
| 12   |  4,096 iterations |    594.3 ms |
| 13   |  8,192 iterations |  1,169.5 ms |
| 14   | 16,384 iterations |  2,338.8 ms |
| 15   | 32,768 iterations |  4,656.0 ms |
| 16   | 65,536 iterations |  9,302.2 ms |

*/

/**
* Return bcrypt hash for a given plain text string
*/
export async function hashPassword(password: string): Promise<string>{
	const passwordHash = await (new Promise<string>((resolve, reject) => {
		hash(password, 10, (err, hash) => {
			if(err) reject(err);
			else resolve(hash);
		});
	}));
	return passwordHash;
}

/**
* Return boolean if plain text string matches bcrypt hash
*/
export async function checkPassword(password: string, passwordHash: string): Promise<boolean>{
	const isMatch = await (new Promise<boolean>((resolve, reject) => {
		compare(password, passwordHash, (err, res) => {
			if(err) reject(err);
			else resolve(res)
		});
	}));
	return isMatch;
}
