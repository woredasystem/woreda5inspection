import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { WOREDA_NUMBER, WOREDA_NAME } from './lib/constants';

export default getRequestConfig(async () => {
    // Get locale from cookie or default to 'am' (Amharic)
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'am';

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
        now: new Date(),
        timeZone: 'Africa/Addis_Ababa',
        globals: {
            woredaNumber: WOREDA_NUMBER,
            woredaName: WOREDA_NAME,
        }
    };
});
