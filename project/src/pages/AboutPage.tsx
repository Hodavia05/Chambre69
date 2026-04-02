export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#F9F5F6] pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-light text-center mb-12 text-gray-900">
          À propos de <span className="text-[#E8B4B8]">Chambre 69</span>
        </h1>

        <div className="bg-white p-8 md:p-12 mb-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Chambre 69 est née d'une vision simple mais essentielle : offrir aux femmes une lingerie qui allie
            <span className="font-medium text-gray-900"> confort absolu</span>,
            <span className="font-medium text-gray-900"> élégance raffinée</span> et
            <span className="font-medium text-gray-900"> confiance en soi</span>.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Chaque pièce de notre collection est soigneusement sélectionnée pour sublimer votre beauté naturelle
            et vous accompagner dans tous les moments de votre vie, du quotidien aux occasions les plus spéciales.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed">
            Nous croyons que la lingerie est bien plus qu'un simple vêtement : c'est une expression de votre
            féminité, un secret qui vous appartient, une source de confiance qui rayonne de l'intérieur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 text-center">
            <div className="w-16 h-16 bg-[#E8B4B8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✨</span>
            </div>
            <h3 className="text-xl font-medium mb-3 text-gray-900">Élégance</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Des designs raffinés qui subliment votre silhouette avec sophistication
            </p>
          </div>

          <div className="bg-white p-8 text-center">
            <div className="w-16 h-16 bg-[#E8B4B8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💎</span>
            </div>
            <h3 className="text-xl font-medium mb-3 text-gray-900">Confort</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Des matières nobles et délicates pour un bien-être absolu
            </p>
          </div>

          <div className="bg-white p-8 text-center">
            <div className="w-16 h-16 bg-[#E8B4B8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🌟</span>
            </div>
            <h3 className="text-xl font-medium mb-3 text-gray-900">Confiance</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Révélez votre beauté et affirmez votre personnalité
            </p>
          </div>
        </div>

        <div className="bg-[#111111] text-white p-8 md:p-12 mt-8 text-center">
          <h2 className="text-2xl md:text-3xl font-light mb-4">
            Notre Engagement
          </h2>
          <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Chez Chambre 69, nous nous engageons à vous offrir une expérience d'achat exceptionnelle,
            un service client attentif et des produits de qualité supérieure qui respectent votre corps
            et valorisent votre beauté naturelle.
          </p>
        </div>
      </div>
    </div>
  );
};
