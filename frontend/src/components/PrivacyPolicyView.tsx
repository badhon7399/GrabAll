import { useLanguage } from '../context/LanguageContext';

interface PrivacyPolicyViewProps {
  resetAllFilters: () => void;
}

export default function PrivacyPolicyView({ resetAllFilters }: PrivacyPolicyViewProps) {
  const { language } = useLanguage();
  const isEN = language === 'en';

  return (
    <section className="py-8 max-w-4xl mx-auto animate-in fade-in duration-300 text-xs">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-deep-navy">
          {isEN ? 'Privacy Policy' : 'গোপনীয়তা নীতি'}
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
              At GrabAll Goods, we respect your privacy and are committed to protecting your personal data. This privacy policy informs you about how we look after your personal data when you visit our website and tells you about your privacy rights.
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">1. The Data We Collect About You</h3>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong>Financial Data:</strong> includes payment status and transactional metadata (we do not store raw card numbers; secure payment portals like bKash process these directly).</li>
              <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
            </ul>

            <h3 className="text-lg font-bold text-deep-navy pt-2">2. How We Use Your Personal Data</h3>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To register you as a new customer and verify your email.</li>
              <li>To process and deliver your order including managing payments, fees and charges.</li>
              <li>To notify you about changes to our terms or privacy policy.</li>
            </ul>

            <h3 className="text-lg font-bold text-deep-navy pt-2">3. Cookies</h3>
            <p>
              We use secure, HTTP-only cookies to handle user authentication sessions (refresh tokens). You can set your browser to refuse all or some browser cookies, but note that some parts of this website may become inaccessible or not function properly.
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">4. Contact Information</h3>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at <a href="mailto:support@graballgoods.com" className="text-[#0088FF] hover:underline">support@graballgoods.com</a>.
            </p>
          </>
        ) : (
          <>
            <p>
              গ্র্যাবঅল গুডস-এ, আমরা আপনার গোপনীয়তাকে সম্মান করি এবং আপনার ব্যক্তিগত ডেটা সুরক্ষায় প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতি আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং আমাদের ওয়েবসাইট ভিজিট করার সময় আপনার গোপনীয়তার অধিকার সম্পর্কে বিস্তারিত আলোচনা করে।
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">১. আমরা যে তথ্য সংগ্রহ করি</h3>
            <p>
              আমরা আপনার সম্পর্কে বিভিন্ন ধরণের ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং সংরক্ষণ করতে পারি, যা নিম্নরূপ:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>পরিচয় সংক্রান্ত তথ্য:</strong> এর মধ্যে রয়েছে নাম, ব্যবহারকারীর নাম বা অনুরূপ আইডেন্টিফায়ার।</li>
              <li><strong>যোগাযোগের তথ্য:</strong> বিলিং ঠিকানা, ডেলিভারি ঠিকানা, ইমেল ঠিকানা এবং টেলিফোন নম্বর।</li>
              <li><strong>আর্থিক তথ্য:</strong> পেমেন্ট স্ট্যাটাস এবং ট্রানজ্যাকশন মেটাডেটা (আমরা সরাসরি কার্ডের তথ্য সংরক্ষণ করি না; বিকাশ-এর মতো সুরক্ষিত পেমেন্ট গেটওয়ে সরাসরি এগুলো পরিচালনা করে)।</li>
              <li><strong>লেনদেনের বিবরণ:</strong> আপনার ক্রয়কৃত পণ্যের বিবরণ এবং পূর্ববর্তী পেমেন্টের ইতিহাস।</li>
            </ul>

            <h3 className="text-lg font-bold text-deep-navy pt-2">২. কীভাবে আমরা তথ্য ব্যবহার করি</h3>
            <p>
              আমরা শুধুমাত্র আইনসম্মত পরিস্থিতিতে আপনার ব্যক্তিগত তথ্য ব্যবহার করব। সাধারণত আমরা নিচের প্রয়োজনে তথ্য ব্যবহার করি:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>নতুন গ্রাহক হিসেবে আপনার অ্যাকাউন্ট নিবন্ধন ও ইমেল ভেরিফিকেশনের জন্য।</li>
              <li>পেমেন্ট ও ডেলিভারিসহ আপনার অর্ডার প্রসেস এবং সম্পন্ন করার জন্য।</li>
              <li>আমাদের শর্তাবলী বা গোপনীয়তা নীতির পরিবর্তন সম্পর্কে আপনাকে অবহিত করতে।</li>
            </ul>

            <h3 className="text-lg font-bold text-deep-navy pt-2">৩. কুকিজ</h3>
            <p>
              আমরা ব্যবহারকারীর সাইন-ইন সেশন সুরক্ষার জন্য নিরাপদ HTTP-only কুকি ব্যবহার করি। আপনি চাইলে ব্রাউজারে কুকি বন্ধ করে রাখতে পারেন, তবে এর ফলে ওয়েবসাইটের কিছু সুবিধা সঠিকভাবে কাজ নাও করতে পারে।
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">৪. যোগাযোগ</h3>
            <p>
              আমাদের গোপনীয়তা নীতি সম্পর্কে কোন প্রশ্ন থাকলে দয়া করে আমাদের ইমেল করুন: <a href="mailto:support@graballgoods.com" className="text-[#0088FF] hover:underline">support@graballgoods.com</a>।
            </p>
          </>
        )}
      </div>
    </section>
  );
}
