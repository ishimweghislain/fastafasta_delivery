'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Clock, MapPin, ArrowLeft } from 'lucide-react'

export default function OrderConfirmationPage() {
  useEffect(() => {
    // Clear any remaining cart items
    localStorage.removeItem('cart')
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex shrink-0 items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              🍔 FastaFasta
            </Link>
            <nav className="flex shrink-0 items-center space-x-6">
              <Link href="/restaurants" className="text-foreground hover:text-primary">
                Restaurants
              </Link>
              <Link href="/favorites" className="text-foreground hover:text-primary">
                Favorites
              </Link>
              <Link href="/cart" className="text-foreground hover:text-primary">
                Cart
              </Link>
              <Link href="/admin/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Thank you for your order. We've received it and will start preparing your delicious food right away.
          </p>

          {/* Order Details Card */}
          <div className="bg-card border rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-lg mb-4">What happens next?</h2>
            <div className="space-y-4">
              <div className="flex shrink-0 items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Order Confirmation</h3>
                  <p className="text-sm text-muted-foreground">You'll receive an email confirmation shortly</p>
                </div>
              </div>
              <div className="flex shrink-0 items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Restaurant Accepts</h3>
                  <p className="text-sm text-muted-foreground">The restaurant will review and accept your order</p>
                </div>
              </div>
              <div className="flex shrink-0 items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Preparation</h3>
                  <p className="text-sm text-muted-foreground">Your food will be prepared with fresh ingredients</p>
                </div>
              </div>
              <div className="flex shrink-0 items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary font-semibold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-medium">On the Way</h3>
                  <p className="text-sm text-muted-foreground">Your order will be delivered to your location</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border rounded-lg p-4">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Estimated Time</h3>
              <p className="text-sm text-muted-foreground">25-35 minutes</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Delivery</h3>
              <p className="text-sm text-muted-foreground">To your location</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Payment</h3>
              <p className="text-sm text-muted-foreground">Processed securely</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/restaurants" 
              className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 font-medium"
            >
              Order More Food
            </Link>
            <Link 
              href="/" 
              className="border border-input px-6 py-3 rounded-md hover:bg-accent font-medium flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Customer Support */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you have any questions about your order, our customer support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <div>
                <span className="font-medium">Email:</span> support@fastafasta.com
              </div>
              <div>
                <span className="font-medium">Phone:</span> +1-800-FASTA
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
