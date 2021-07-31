import { environment } from '@environments/environment';
import { IConfig } from '@models/core.model';


export const AppConfig: IConfig = {
    ...environment,
    theme: 'dark',
};
