import dayjs from 'dayjs';
import 'dayjs/locale/ja';

dayjs.locale('ja');

export function getTime(): string {
  return dayjs().format('YYYY年M月D日 (ddd) HH:mm');
}
