import { useState } from 'react'
import { Mail, Github, Linkedin, Compass, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { contact } from '../data'
import { useInView } from 'react-intersection-observer'

export default function Contact() {
  const { ref, inView } = useInView({ threshold: 0.1 })
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'contact',
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }).toString(),
      })

      if (response.ok) {
        setStatus('sent')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }

    setTimeout(() => setStatus(null), 5000)
  }

  return (
    <section id="contact" className="py-24 sm:py-32 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 flex items-center gap-4">
            <span className="gradient-text">Contact</span>
            <span className="h-px flex-1 bg-gradient-to-r from-[#374151] to-transparent" />
          </h2>
          <p className="text-[#6b7280] mb-12">
            {contact.subtitle}
          </p>

          <div className="gradient-border p-8">
            <form
              name="contact"
              data-netlify="true"
              netlify-honeypot="bot-field"
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="form-name" value="contact" />
              
              <div className="hidden">
                <label>
                  Don't fill this out if you're human:
                  <input name="bot-field" />
                </label>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#9ca3af] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#9ca3af] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#9ca3af] mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sent' || status === 'submitting'}
                className="w-full px-6 py-3 bg-primary hover:bg-primary-dark disabled:bg-[#374151] text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 glow"
              >
                {status === 'sent' ? (
                  <>
                    <CheckCircle size={18} />
                    Message Sent!
                  </>
                ) : status === 'submitting' ? (
                  <>
                    <Send size={18} />
                    Sending...
                  </>
                ) : status === 'error' ? (
                  <>
                    <AlertCircle size={18} />
                    Error - Try Again
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>

              {status === 'sent' && (
                <div className="text-center text-green-400 text-sm">
                  Thanks! Your message has been sent successfully.
                </div>
              )}
              {status === 'error' && (
                <div className="text-center text-red-400 text-sm">
                  Something went wrong. Please try again or email me directly.
                </div>
              )}
            </form>

            <div className="mt-8 pt-8 border-t border-[#1f2937] space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors"
                >
                  <Mail size={18} />
                  <span className="text-sm">{contact.email}</span>
                </a>
                <span className="hidden sm:inline text-[#374151]">•</span>
                <a href={`tel:${contact.phone.replace(/\D/g, '')}`} className="flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors">
                  <Phone size={18} />
                  <span className="text-sm">{contact.phone}</span>
                </a>
                <span className="hidden sm:inline text-[#374151]">•</span>
                <span className="flex items-center gap-2 text-[#9ca3af]">
                  <MapPin size={18} />
                  <span className="text-sm">{contact.location}</span>
                </span>
              </div>
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-[#1f2937]">
                <a
                  href={contact.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors"
                >
                  <Github size={18} />
                  <span className="text-sm">GitHub</span>
                </a>
                <a
                  href={contact.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors"
                >
                  <Linkedin size={18} />
                  <span className="text-sm">LinkedIn</span>
                </a>
                <a
                  href={contact.socials.trailblazer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors"
                >
                  <Compass size={18} />
                  <span className="text-sm">Trailblazer</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
