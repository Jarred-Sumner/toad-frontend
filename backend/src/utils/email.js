import Email from 'email-templates'
import nodemailer from 'nodemailer'
import aws from 'aws-sdk'
import config from '../config'

const emailUrl = `${config('hostname')}/login?token=`

const transporter = nodemailer.createTransport({
  SES: new aws.SES({
    apiVersion: '2010-12-01',
    region: 'us-west-2',
  }),
})
const email = new Email({
  message: {
    from: '"Toads" <noreply@toads.app>',
  },
  // uncomment below to send emails in development/test env:
  // send: false,
  transport: transporter,
})

export default ({ token, destination }) =>
  email.send({
    template: 'login',
    message: {
      to: destination,
    },
    locals: {
      url: emailUrl + token,
    },
  })
