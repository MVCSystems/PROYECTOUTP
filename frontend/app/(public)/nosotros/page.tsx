import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NosotrosPage: React.FC = () => {
  const sections = [
    {
      title: "¿Quiénes somos?",
      content:
        "Nuestra misión es garantizar la seguridad y bienestar de la comunidad en el distrito de José Leonardo Ortiz, a través de la vigilancia continua, la prevención del delito, y la promoción de una cultura de participación ciudadana y transparencia. Trabajamos en conjunto con los vecinos y autoridades para construir un entorno seguro y confiable para todos, fomentando la confianza y la cooperación en cada acción que emprendemos. Nuestro compromiso es ser un referente en la protección y el servicio a la ciudadanía.",
    },
    {
      title: "¿Qué hacemos?",
      content:
        "Nuestra visión es ser reconocidos como el modelo ejemplar de seguridad ciudadana en el distrito de José Leonardo Ortiz, donde cada habitante se sienta protegido y respaldado. Aspiramos a consolidar una comunidad unida y activa, donde la participación ciudadana sea el pilar fundamental para mantener la paz y el orden, y donde la transparencia y la eficiencia en nuestras acciones generen un entorno de confianza y progreso sostenible para todos.",
    },
  ];

  const CardVert = {
    title: "¿Por qué somos diferentes?",
    content:
      "Nos destacamos por nuestro enfoque integral en la seguridad ciudadana, combinando tecnología, participación comunitaria y estrategias innovadoras. Nuestro equipo está comprometido con la excelencia y la transparencia, trabajando incansablemente para garantizar un entorno seguro y próspero para todos los habitantes del distrito.",
  };

  return (
    <section className="pt-10 pb-16 bg-white dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="flex justify-center items-center">
          <Image
            src="/observatorio.svg"
            alt="Portada"
            className="object-contain rounded-lg"
            width={500}
            height={100}
            priority
            quality={50}
          />
        </div>
        <div className="grid grid-cols-1 gap-8 mt-4 md:grid-cols-2">
          {sections.map(({ title, content }, index) => (
            <Card key={index} className="rounded-lg shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-justify text-gray-700 dark:text-gray-300">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-justify text-gray-700 dark:text-gray-300">
                  {content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <Card className="rounded-lg shadow-lg md:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl text-justify text-gray-700 dark:text-gray-300">
                {CardVert.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-justify text-gray-700 dark:text-gray-300">
                {CardVert.content}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default NosotrosPage;