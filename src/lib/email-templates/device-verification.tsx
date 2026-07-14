import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  code: string
  deviceLabel: string
  siteName: string
}

const DeviceVerificationEmail = ({ code, deviceLabel, siteName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your {siteName} sign-in code: {code}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New device sign-in</Heading>
        <Text style={text}>
          Someone (hopefully you) just signed in to your {siteName} account from a
          new device: <strong>{deviceLabel}</strong>.
        </Text>
        <Text style={text}>
          Enter this 6-digit code to confirm it was you. The code expires in 15 minutes.
        </Text>
        <Section style={codeBox}>
          <Text style={codeStyle}>{code}</Text>
        </Section>
        <Text style={warning}>
          If this wasn't you, someone may have your password. Change it immediately
          and do not enter this code anywhere.
        </Text>
        <Text style={footer}>
          You received this because a sign-in to your account was attempted from a new device.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: DeviceVerificationEmail,
  subject: (data: Record<string, any>) =>
    `Your ${data.siteName ?? 'Onyx'} sign-in code: ${data.code}`,
  displayName: 'Device Verification',
  previewData: { code: '123456', deviceLabel: 'Chrome on Mac', siteName: 'Onyx Elevate' },
} satisfies TemplateEntry

export default DeviceVerificationEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '20px 25px', maxWidth: '520px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#000000', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.5', margin: '0 0 16px' }
const codeBox = {
  backgroundColor: '#0b0b0f',
  borderRadius: '10px',
  padding: '20px',
  textAlign: 'center' as const,
  margin: '24px 0',
}
const codeStyle = {
  fontSize: '32px',
  fontWeight: 'bold' as const,
  letterSpacing: '8px',
  color: '#00d4ff',
  margin: 0,
}
const warning = {
  fontSize: '13px',
  color: '#b91c1c',
  lineHeight: '1.5',
  margin: '20px 0 0',
}
const footer = { fontSize: '12px', color: '#999999', margin: '24px 0 0' }
