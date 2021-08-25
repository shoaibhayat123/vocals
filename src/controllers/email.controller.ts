// import mailgun, { Mailgun, Attachment } from 'mailgun-js';
import nodemailer from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { Attachment } from 'nodemailer/lib/mailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { IUser } from '../models/user.model';
import { CONFIG, TEMPLATES } from '../models/constants';

export interface SendMailgunTemplateParams<T> {
    templateName: string,
    to: string | string[],
    cc?: string,
    subject?: string,
    params: T,
    language: 'en' | 'fr',
    attachments?: Attachment[]
}
interface sendUserResetPasswordEmailParams {
    user: IUser,
    resetToken: string,
}

export class EmailController {
    private mg: any;
    constructor() {
        this.mg = nodemailer.createTransport({
            host: CONFIG.MAIL.HOST,
            port: CONFIG.MAIL.PORT,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: CONFIG.MAIL.EMAIL_FROM,
                clientId: CONFIG.MAIL.CLIENT_ID,
                clientSecret: CONFIG.MAIL.CLIENT_SECRET,
                refreshToken: CONFIG.MAIL.REFRESH_TOEKN
            }
        });

    }

    public async sendMailgunTemplate<T = any>({ templateName, to, cc, params, language, attachments }: SendMailgunTemplateParams<T>) {
        if (!language) language = 'en';
        let _subject: string, _template: string;
        try {
            _template = TEMPLATES[language][templateName]['template'];
            _subject = TEMPLATES[language][templateName]['subject'].replace(/{{.?clientName.?}}/ig, (<any>params).clientName);
        } catch (e) {
            throw e;
        }
        let data: any = {
            from: CONFIG.MAIL.EMAIL_FROM,
            to: to,
            subject: _subject,
            template: _template,
            text: JSON.stringify(params),
            attachment: attachments
        };

        if (cc) data.cc = cc;
        const response = await (new Promise((resolve, reject) => {
            this.mg.sendMail(data, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve('Email sent: ' + info.response);
                }
            });
            // this.mg.messages().send(data, (err, body) => {
            // 	if (err) reject(err);
            // 	else resolve(body);
            // });
        }));
    }

    public async sendUserResetPasswordEmail({ user, resetToken }: sendUserResetPasswordEmailParams) {
        const resetPasswordURL = `${CONFIG.ENVIRONMENT_CONFIG.ADMIN_URL}/account/resetpassword/${resetToken}`;
        await this.sendMailgunTemplate({
            templateName: 'forgotpassword',
            to: user.email,
            language: user.langPref,
            params: {
                resetPasswordURL
            }
        });
    }

    public async readHTMLFile(path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    public async send(_subject, detail: any, to, cc, filename, resetToken) {
        const resetPasswordURL = `${CONFIG.ENVIRONMENT_CONFIG.ADMIN_URL}/setpassword/${resetToken}`;
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: CONFIG.MAIL.HOST,
            port: CONFIG.MAIL.PORT,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: CONFIG.MAIL.EMAIL_FROM,
                clientId: CONFIG.MAIL.CLIENT_ID,
                clientSecret: CONFIG.MAIL.CLIENT_SECRET,
                refreshToken: CONFIG.MAIL.REFRESH_TOEKN
            }
        } as SMTPTransport.Options);
        const response = await (new Promise((resolve, reject) => {
            this.readHTMLFile(`${path.dirname(CONFIG.ROOT_FILE as any)}/template/${filename}`, function(err, html) {
                var template = handlebars.compile(html);
                // logoUrl: 'http://52.54.42.5:8187/images/logo.png',
                const replacements = {
                    logoUrl: '',
                    url: resetPasswordURL,
                    // token: resetToken,
                    message: !detail.message ? '' : detail.message,
                    heading: !detail.heading ? '' : detail.heading,
                    payorEmail: !detail.payorEmail ? '' : detail.payorEmail,
                    email: !to ? '' : to,
                    firstName: !detail.firstName ? '' : detail.firstName,
                    lastName: !detail.lastName ? '' : detail.lastName,
                    role: !detail.role ? '' : detail.role,
                    code: !detail.code ? '' : detail.code,
                    name: !detail.name ? '' : detail.name,
                    phone: !detail.phone ? '' : detail.phone,
                    phone_1: !detail.phone_1 ? '' : detail.phone_1,
                    phone_2: !detail.phone_2 ? '' : detail.phone_2,
                    comment: !detail.comment ? '' : detail.comment,
                    contact: !detail.contact ? '' : detail.contact,
                    industry: !detail.industry ? '' : detail.industry,
                    amount: !detail.amount ? 0 : detail.amount,
                    title: !detail.title ? '' : detail.title,
                    startDate: !detail.startDate ? '' : detail.startDate,
                    summary: !detail.summary ? '' : detail.summary,
                    documentUrl: !detail.documentUrl ? '' : detail.documentUrl,
                    members: !detail.members ? [] : detail.members.length > 0 ? JSON.stringify(detail.members) : []
                } as any;
                var htmlToSend = template(replacements);
                const data = {
                    from: CONFIG.MAIL.EMAIL_FROM,
                    to: to,
                    cc: cc,
                    subject: _subject,
                    html: htmlToSend,
                };
                transporter.sendMail(data, (error, info) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve('Email sent: ' + info.response);
                    }
                });
            });
        }));
    }
}


export default new EmailController();
