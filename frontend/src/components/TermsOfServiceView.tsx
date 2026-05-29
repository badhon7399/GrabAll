import { useLanguage } from '../context/LanguageContext';

interface TermsOfServiceViewProps {
  resetAllFilters: () => void;
}

export default function TermsOfServiceView({ resetAllFilters }: TermsOfServiceViewProps) {
  const { language } = useLanguage();
  const isEN = language === 'en';

  return (
    <section className="py-8 max-w-4xl mx-auto animate-in fade-in duration-300 text-xs">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-deep-navy">
          {isEN ? 'Terms of Service' : 'সেবার শর্তাবলী'}
        </h2>
        <button 
          onClick={resetAllFilters}
          className="px-4 py-2 border rounded-xl hover:bg-surface-container-low font-semibold transition-all text-xs"
        >
          {isEN ? 'Back to Home' : 'হোমে ফিরে যান'}
        </button>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm p-6 md:p-8 space-y-6 text-on-surface leading-relaxed text-sm">
        <p className="text-xs text-on-surface-variant font-mono">
          {isEN ? 'Last Updated: May 29, 2026' : 'সর্বশেষ আপডেট: ২৯ মে, ২০২৬'}
        </p>

        {isEN ? (
          <>
            <p>
              Welcome to GrabAll Goods. These terms and conditions outline the rules and regulations for the use of GrabAll Goods' Website. By accessing this website, we assume you accept these terms and conditions in full.
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">1. User Accounts & Registration</h3>
            <p>
              To access certain features of our platform, you are required to register for an account. You must verify your email address to active your profile. You are responsible for keeping your account details, password, and session access confidential.
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">2. Product Availability & Pricing</h3>
            <p>
              All prices shown on our website are in Bangladeshi Taka (BDT) and are subject to change without notice. We reserve the right to modify or discontinue products at any time. In the event of a listing error, we reserve the right to cancel affected orders and issue a refund.
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">3. Orders and Payments</h3>
            <p>
              By placing an order, you agree to buy the selected items at their listed prices. Payment can be completed online via bKash or other supported channels. Orders are only processed after successful payment verification.
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">4. Prohibited Uses</h3>
            <p>
              You may not use our site for any unlawful purpose, or to solicit others to perform unlawful acts. We reserve the right to terminate your account or block your access for violating any terms.
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">5. Governing Law</h3>
            <p>
              These terms are governed by and construed in accordance with the laws of Bangladesh. Any dispute arising out of your use of this website shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.
            </p>
          </>
        ) : (
          <>
            <p>
              গ্র্যাবঅল গুডস-এ আপনাকে স্বাগতম। এই শর্তাবলী গ্র্যাবঅল গুডস ওয়েবসাইটের ব্যবহারের নিয়ম ও নির্দেশাবলী প্রকাশ করে। এই ওয়েবসাইট অ্যাক্সেস করার মাধ্যমে আমরা ধরে নিচ্ছি যে আপনি এই শর্তাবলী সম্পূর্ণভাবে মেনে নিয়েছেন।
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">১. গ্রাহক অ্যাকাউন্ট এবং নিবন্ধন</h3>
            <p>
              আমাদের প্ল্যাটফর্মের বিশেষ সুবিধা ও কেনাকাটা করতে আপনাকে একটি অ্যাকাউন্ট রেজিস্টার করতে হবে এবং ইমেল যাচাইকরণ সম্পন্ন করতে হবে। আপনার অ্যাকাউন্ট লগইন তথ্য ও পাসওয়ার্ডের গোপনীয়তা বজায় রাখার দায়িত্ব আপনার।
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">২. পণ্যের প্রাপ্যতা ও মূল্য</h3>
            <p>
              আমাদের ওয়েবসাইটে প্রদর্শিত সকল মূল্য বাংলাদেশী টাকায় (BDT) এবং এটি যেকোনো সময় পরিবর্তন হতে পারে। আমরা যেকোনো সময় যেকোনো পণ্য সংশোধন বা বন্ধ করার অধিকার সংরক্ষণ করি। তথ্যের ভুলের কারণে কোনো পণ্যের মূল্য ভুল প্রদর্শিত হলে আমরা অর্ডার বাতিল করার অধিকার রাখি।
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">৩. অর্ডার ও পেমেন্ট</h3>
            <p>
              অর্ডার করার মাধ্যমে আপনি পণ্যের নির্ধারিত মূল্যে তা ক্রয়ের সম্মতি প্রদান করছেন। বিকাশ বা অন্যান্য পেমেন্ট গেটওয়ের মাধ্যমে পেমেন্ট সম্পন্ন করা যাবে। সফল পেমেন্ট ভেরিফিকেশনের পরই অর্ডার প্রসেসিং শুরু হবে।
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">৪. নিষিদ্ধ ব্যবহার</h3>
            <p>
              আপনি কোনো বেআইনি কাজের উদ্দেশ্যে আমাদের সাইট ব্যবহার করতে পারবেন না। যেকোনো শর্ত লঙ্ঘনের জন্য আমরা আপনার অ্যাকাউন্ট বন্ধ করার বা আপনার অ্যাক্সেস ব্লক করার অধিকার রাখি।
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">৫. প্রযোজ্য আইন</h3>
            <p>
              এই শর্তাবলী বাংলাদেশের আইন অনুযায়ী পরিচালিত হবে। ওয়েবসাইট ব্যবহারের সাথে সম্পর্কিত যেকোনো বিরোধ ঢাকা, বাংলাদেশের আদালতের একচ্ছত্র এখতিয়ারের অধীন হবে।
            </p>
          </>
        )}
      </div>
    </section>
  );
}
