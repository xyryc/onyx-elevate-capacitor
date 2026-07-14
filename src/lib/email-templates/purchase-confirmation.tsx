import React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  planName?: string
  amount?: string
  isSubscription?: boolean
  isLifetime?: boolean
  accessSummary?: string
}

const PurchaseConfirmationEmail = ({
  planName = 'Onyx membership',
  amount,
  isSubscription = false,
  isLifetime = false,
  accessSummary,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to Onyx, your purchase is confirmed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to Onyx 🖤</Heading>
        <Text style={text}>
          Your purchase of <strong>{planName}</strong> is confirmed
          {amount ? ` (${amount})` : ''}. You're officially an Onyx member.
        </Text>
        <Section style={card}>
          <Text style={cardTitle}>What you unlocked</Text>
          <Text style={text}>
            {accessSummary
              ? accessSummary
              : isLifetime
                ? 'Lifetime access to every current and future training program and meal plan, free forever.'
                : isSubscription
                  ? 'Full access to every training program and meal plan for the duration of your subscription.'
                  : '1 year of access to your selected program and meal plan.'}
          </Text>
        </Section>
        <Hr style={hr} />
        <Text style={text}>
          Open the app and jump straight into your programs. If you have any questions, just reply to this email.
        </Text>
        <Text style={footer}>- The Onyx Elevate team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PurchaseConfirmationEmail,
  subject: 'Welcome to Onyx, purchase confirmed',
  displayName: 'Purchase confirmation',
  previewData: {
    planName: 'Onyx Pro',
    amount: '$29.00',
    isSubscription: true,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', color: '#0a0a0a' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '24px', margin: '0 0 16px', color: '#0a0a0a' }
const text = { fontSize: '15px', lineHeight: '24px', color: '#1f2937', margin: '0 0 12px' }
const card = { backgroundColor: '#f5f5f4', borderRadius: '12px', padding: '18px 20px', margin: '20px 0' }
const cardTitle = { fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#525252', margin: '0 0 8px' }
const hr = { borderColor: '#e5e5e5', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#737373', marginTop: '20px' }
