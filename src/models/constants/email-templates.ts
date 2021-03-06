// Map Template files to Mailgun template names
interface TemplateMap {
    [key: string]: {
        template: string,
        subject: string,
    }
}

export const TEMPLATES: {
    en: TemplateMap,
    fr: TemplateMap,
} = {
    en: {
        'server-error': {
            template: 'server-error',
            subject: `Server Error`,
        },
        'signUp': {
            template: 'sign-up',
            subject: 'User Created',
        },
        'sendCode': {
            template: 'send-code',
            subject: 'Confirm Code',
        },
        'subscription': {
            template: 'contact',
            subject: 'Subscription of Newsletter',
        },
        'orderPending': {
            template: 'order-pending',
            subject: 'Order Pending',
        },
        'orderRecieved': {
            template: 'order-recieved',
            subject: 'Recieved Order',
        },
        'orderInProcess': {
            template: 'order-in-process',
            subject: 'Order In Process',
        },
        'orderReady': {
            template: 'order-ready',
            subject: 'Order Ready',
        },
        'orderAssigned': {
            template: 'order-assigned',
            subject: 'Order Assigned',
        },
        'orderPicked': {
            template: 'order-picked',
            subject: 'Order Picked',
        },
        'orderCheckout': {
            template: 'order-checkout',
            subject: 'Order Checkout',
        },
        'orderCompleted': {
            template: 'order-completed',
            subject: 'Order Completed',
        },
        'resetPassword': {
            template: 'reset-password',
            subject: 'Reset Password',
        },
        'passwordChanged': {
            template: 'password-changed',
            subject: 'Password Changed',
        },
        'forgotpassword': {
            template: 'forgot-password',
            subject: 'Reset Password',
        },
        'subscribeInfo': {
            template: 'subscribe',
            subject: 'Subscribe Information',
        },
        'contactInfo': {
            template: 'contact',
            subject: 'Contact Information',
        },
        'validate-email': {
            template: 'forgot-password',
            subject: '[TEMPLATE PENDING] Validate Email Address',
        }
    },
    fr: {
        'server-error': {
            template: 'server-error-fr',
            subject: `Server ErrorFR`,
        },
        'passwordChanged': {
            template: 'password-changed-fr',
            subject: 'Password ChangedFR',
        },
        'forgotpassword': {
            template: 'forgot-password-fr',
            subject: 'Reset PasswordFR',
        },
        'validate-email': {
            template: 'forgot-password-fr',
            subject: '[TEMPLATE PENDING] Validate Email AddressFR',
        }
    },
};
