import { MessageCircle, Instagram, Mail } from 'lucide-react';

export const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#F9F5F6] pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-light text-center mb-12 text-gray-900">
          Nous Contacter
        </h1>

        <div className="bg-white p-8 md:p-12 mb-8 text-center">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Notre équipe est à votre écoute pour répondre à toutes vos questions et vous accompagner
            dans votre choix. N'hésitez pas à nous contacter via vos canaux préférés.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <a
              href="https://wa.me/33123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center p-8 bg-[#F9F5F6] hover:bg-[#E8B4B8]/10 transition-all duration-300"
            >
              <div className="w-20 h-20 bg-[#25D366] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">WhatsApp</h3>
              <p className="text-sm text-gray-600">
                Commandez directement via WhatsApp pour un service rapide et personnalisé
              </p>
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center p-8 bg-[#F9F5F6] hover:bg-[#E8B4B8]/10 transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Instagram className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">Instagram</h3>
              <p className="text-sm text-gray-600">
                Suivez-nous pour découvrir nos nouveautés et nos inspirations
              </p>
            </a>

            <a
              href="mailto:contact@chambre69.com"
              className="group flex flex-col items-center p-8 bg-[#F9F5F6] hover:bg-[#E8B4B8]/10 transition-all duration-300"
            >
              <div className="w-20 h-20 bg-[#E8B4B8] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">Email</h3>
              <p className="text-sm text-gray-600">
                Écrivez-nous pour toute demande d'information
              </p>
            </a>
          </div>
        </div>

        <div className="bg-[#111111] text-white p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-light mb-4">
            Horaires de Service
          </h2>
          <p className="text-gray-300 mb-4">
            Lundi - Vendredi : 9h00 - 19h00
          </p>
          <p className="text-gray-300">
            Samedi : 10h00 - 18h00
          </p>
          <p className="text-gray-400 text-sm mt-6">
            Nous répondons généralement dans les 24 heures
          </p>
        </div>
      </div>
    </div>
  );
};
