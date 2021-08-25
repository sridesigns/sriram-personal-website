import { graph } from "../../graphql/services/graphcms";
import { GetCaseStudies } from "../../graphql/data/projects/casestudies";
import Image from "next/image";
import Header from "../../components/Header";



export async function getStaticProps() {
  const { data } = await graph.query({
    query: GetCaseStudies,
  });

  return {
    props: {
      projects: data.caseStudies
    },
  };
}


export default function CaseStudies({ projects }) {
  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-light text-gray-700 my-10 uppercase tracking-widest">Case Studies</h1>
        <div className="space-y-8">
          {projects.map((project) => (
            <div key={project.slug}>
              <h3 className="text-2xl font-bold pb-2">{project.title}</h3>
              <p className="text-base font-normal text-gray-600">{project.summary}</p>
              <Image
                src={project.bannerImage.url}
                width={project.bannerImage.width}
                height={project.bannerImage.height}
                alt={project.title}
              />
            </div>
          )
          )}
        </div>
      </div>
    </>
  )
}