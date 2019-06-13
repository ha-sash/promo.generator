import { get, has } from 'config';

export class PromoGenerator {

  private combinations = 0;

  private cache: any = {};
  private digits: number[] = [];
  private digitsPos: number[] = [];

  private placeholders: {[k: string]: string} = {
    'A': 'ABCDEFGHJKLMNPQRSTUVWXYZ',
    '9': '123456789',
    '#': 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  };

  public constructor(private pattern: string, private position = 0) {
    this.initPlaceholders();
    this.combinations = this.countCombinations();
    this.setDigits();
    if (position !== 0) {
      this.setDigitsPosByPos();
    }
  }

  public next(): string | null {
    const result = this.currentCode();
    this.position += 1;
    for (let i = this.digits.length - 1; i >= 0; i -= 1) {
      this.digitsPos[i] += 1;
      if (this.digitsPos[i] === this.digits[i]) {
        this.digitsPos[i] = 0;
      } else {
        break;
      }
    }
    return result;
  }

  public getCombinations(): number {
    return this.combinations;
  }

  public getPosition(): number {
    return this.position;
  }

  public currentCode(): string | null {
    if (this.combinations <= this.position) {
      return null;
    }
    const quote = "'";
    let code = '';
    let quoteOpen = false;
    let i = 0;
    this.pattern.split('').forEach((c: string) => {
      if (!quoteOpen) {
        if (this.placeholders[c]) {
          code += this.placeholders[c][this.digitsPos[i]];
          i += 1;
        } else if (c === quote) {
          quoteOpen = true;
        } else {
          code += c;
        }
      } else {
        if (c === quote) {
          quoteOpen = false;
        } else {
          code += c;
        }
      }
    });
    return code;
  }

  private initPlaceholders(): void {
    if (has('promocodeGeneratorPlaceholders')) {
      this.placeholders = get('promocodeGeneratorPlaceholders');
    }
  }

  private setDigitsPosByPos(): void {
    const result: number[] = [];
    const digits = this.digits.reverse();
    let x = this.position;
    for (const d of digits) {
      const n = x % d;
      if (n >= 0) {
        result.unshift(Math.floor(n));
      } else {
        throw new Error('Panic...');
      }
      x = x / d;
    }
    this.digitsPos = result;
  }

  private randomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  private setDigits(): void {
    this.pattern.split('').forEach((c: string) => {
      if (this.placeholders[c]) {
        this.digits.push(this.placeholders[c].length);
        this.digitsPos.push(0);
      }
    });
  }

  private countCombinations() {
    const quote = "'";
    let combinations = 1;
    let quoteOpen = false;
    this.pattern.split('').forEach((c: string) => {
      if (!quoteOpen) {
        if (this.placeholders[c]) {
          combinations *= this.placeholders[c].length;
        } else if (c === quote) {
          quoteOpen = true;
        }
      } else if (c === quote) {
        quoteOpen = false;
      }
    });
    return combinations;
  }

}
