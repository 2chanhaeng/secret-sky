const BASE32_ALPHABET = "234567abcdefghijklmnopqrstuvwxyz";
const CLOCK_ID = Number(process.env.CLOCK_ID) ||
  Math.floor(Math.random() * 1024);
const TID_LENGTH = 13; // TID 문자열 길이는 항상 13자리

/**
 * 주어진 Date 객체에 대해 TID를 생성합니다.
 * TID는 64비트 정수로 구성되며,
 * - 상위 1비트는 항상 0,
 * - 다음 53비트는 UNIX epoch 이후의 마이크로초,
 * - 마지막 10비트는 전역 CLOCK_ID입니다.
 * 이 값을 base32-sortable (문자셋 "234567abcdefghijklmnopqrstuvwxyz")로 인코딩하여 13자리 문자열로 반환합니다.
 *
 * @param date - TID를 생성할 기준 시간 (Date 객체)
 * @returns 13자리의 TID 문자열
 */
export function generateTID(date: Date): string {
  // 1. Date 객체의 getTime()은 밀리초 단위이므로, 이를 1000을 곱해 마이크로초 단위의 BigInt로 변환합니다.
  const ms = BigInt(date.getTime()) * 1000n;

  // 2. 전역 CLOCK_ID를 10비트 값으로 사용 (0 ~ 1023)
  const clockId = BigInt(CLOCK_ID);

  // 3. TID 값 계산: (microseconds << 10) | clockId
  const tidNumber = (ms << 10n) | clockId;

  // 4. Base32-sortable 인코딩 (알파벳: "234567abcdefghijklmnopqrstuvwxyz")
  const digits: string[] = new Array(TID_LENGTH);
  let value = tidNumber;

  // 5. for 문을 사용하여 13자리 문자열을 만듭니다.
  //    가장 낮은 자리부터 32진수로 변환한 후, 배열의 뒤쪽(인덱스 12부터 0까지)에 채워 넣습니다.
  for (let i = TID_LENGTH - 1; i >= 0; i--) {
    const remainder = value % 32n;
    digits[i] = BASE32_ALPHABET[Number(remainder)];
    value /= 32n;
  }

  return digits.join("");
}
