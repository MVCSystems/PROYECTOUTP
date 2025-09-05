import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/axios";
import { ArchivoAreaApiResponse } from "@/types/public";

export default async function Page() {
  const currentYear = new Date().getFullYear();
  const dataList = [];

  for (let year = currentYear; year > currentYear - 5; year--) {
    const res = await api.get(
      `/areas/archivos/?año=${year}&area__name=codisec`
    );
    const data: ArchivoAreaApiResponse = res.data;
    dataList.push({
      año: year,
      archivos: data.results,
    });
  }

  return (
    <div className="p-4">
      <Card className="max-w-1/3">
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {dataList.map((item, index) =>
              item.archivos.length === 0 ? null : (
                <AccordionItem value={index.toString()} key={index}>
                  <AccordionTrigger className="cursor-pointer">
                    {item.año}
                  </AccordionTrigger>
                  <AccordionContent>
                    {item.archivos.map((archivo) => (
                      <div key={archivo.id}>
                        <a
                          href={archivo.archivo}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {archivo.nombre}
                        </a>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              )
            )}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
