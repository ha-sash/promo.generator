# promo.generator

The library allows you to generate promotional codes. You can start from any position. The character set can also be customized.

Example:
```typescript
import { info } from 'console';
import { PromoGenerator } from 'promo.generator';

const cr = new PromoGenerator('#####9', 35221);

info(`number of combinations: ${cr.combinations}`);
info(`CODE: ${cr.next()}`);
info(`CODE: ${cr.next()}`);
info(`CODE: ${cr.next()}`);

// result
// number of combinations: 352218537
// CODE: AADVV5
// CODE: AADVV6
// CODE: AADVV7

```

In the case of JavaScript, it looks about the same, probably.
