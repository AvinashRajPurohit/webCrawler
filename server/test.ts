import { addCrawlerPath } from "./crawler/constants"
import { customRequest } from "./crawler/core"

import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

const customConfig: Config = {
  dictionaries: [adjectives, colors],
  separator: '-',
  length: 2,
};

const randomName: string = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals]
}); // big_red_donkey


var test_data = ["https://www.flaconi.de/pflege/oliveda/body-care/oliveda-body-care-b58-extra-virgin-koerperbutter.html#sku=80027617-180",
"https://www.flaconi.de/pflege/dr-irena-eris/circalogy/dr-irena-eris-circalogy-vitalisierende-anti-stress-tagescreme-lsf-30-gesichtscreme.html#sku=80065821-50",
"https://www.flaconi.de/pflege/skindivision/10-azelaic-acid/skindivision-10-azelaic-acid-serum-in-cream-gesichtscreme.html#sku=80073748-30",
"https://www.flaconi.de/pflege/vichy/normaderm/vichy-normaderm-24h-feuchtigkeit-gesichtscreme.html#sku=80020057-50",
"https://www.flaconi.de/pflege/nui-cosmetics/natural/nui-cosmetics-natural-glow-wonder-face-cream-hahana-gesichtscreme.html#sku=80061515-50",
"https://www.flaconi.de/pflege/oliveda/body-care/oliveda-body-care-b54-relaxing-koerperbalsam.html#sku=80027614-250",

// duplicate linkes
"https://www.flaconi.de/pflege/oliveda/body-care/oliveda-body-care-b58-extra-virgin-koerperbutter.html#sku=80027617-180",
"https://www.flaconi.de/pflege/skindivision/10-azelaic-acid/skindivision-10-azelaic-acid-serum-in-cream-gesichtscreme.html#sku=80073748-30",
"https://www.flaconi.de/pflege/oliveda/body-care/oliveda-body-care-b58-extra-virgin-koerperbutter.html#sku=80027617-180",
"https://www.flaconi.de/pflege/nui-cosmetics/natural/nui-cosmetics-natural-glow-wonder-face-cream-hahana-gesichtscreme.html#sku=80061515-50",
"https://www.flaconi.de/pflege/oliveda/body-care/oliveda-body-care-b58-extra-virgin-koerperbutter.html#sku=80027617-180",
"https://www.flaconi.de/pflege/dr-irena-eris/circalogy/dr-irena-eris-circalogy-vitalisierende-anti-stress-tagescreme-lsf-30-gesichtscreme.html#sku=80065821-50",

// invalid links
"https://www.youtube.com/watch?v=r_xlXF3T-G4&list=RDI2nQfiux2sk&index=5",
"https://www.youtube.com/watch?v=CtPhRhwSJd0&list=RDI2nQfiux2sk&index=6"

]

console.log(`NOTE: this script should only run once \n number of data elements: ${test_data.length} \n`,
"6 are duplicates and 2 are invalid links which means completed should be: \n",
test_data.length-8, "should be completed, 4 ignored and 2 failed."
)

test_data.forEach(function(value){
    customRequest(addCrawlerPath, {job_name: uniqueNamesGenerator(customConfig), job_url: value})
    new Promise(f => setTimeout(f, 3000));

  });