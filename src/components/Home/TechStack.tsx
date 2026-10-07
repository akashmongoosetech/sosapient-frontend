import React from 'react';

export interface HomeTech {
  name: string;
  logo: string;
  color: string;
}

export const TECHNOLOGIES: HomeTech[] = [
    // Frontend Frameworks
    { 
      name: 'Angular', 
      logo: '/tech/angularjs/angularjs-original.svg',
      color: 'from-red-500 to-red-700'
    },
    { 
      name: 'React', 
      logo: '/tech/react/react-original.svg',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      name: 'Vue.js', 
      logo: '/tech/vuejs/vuejs-original.svg',
      color: 'from-green-500 to-green-700'
    },
    { 
      name: 'Next.js', 
      logo: '/tech/nextjs/nextjs-original.svg',
      color: 'from-gray-700 to-gray-900'
    },
    { 
      name: 'ExtJS', 
      logo: '/tech/javascript/javascript-original.svg',
      color: 'from-yellow-400 to-yellow-600'
    },

    // Core Web Technologies
    { 
      name: 'HTML5', 
      logo: '/tech/html5/html5-original.svg',
      color: 'from-orange-500 to-orange-700'
    },
    { 
      name: 'CSS3', 
      logo: '/tech/css3/css3-original.svg',
      color: 'from-blue-500 to-blue-700'
    },
    { 
      name: 'JavaScript', 
      logo: '/tech/javascript/javascript-original.svg',
      color: 'from-yellow-400 to-yellow-600'
    },

    // Mobile Development
    { 
      name: 'React Native', 
      logo: '/tech/react/react-original.svg',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      name: 'iOS', 
      logo: '/tech/apple/apple-original.svg',
      color: 'from-gray-600 to-gray-800'
    },
    { 
      name: 'Android', 
      logo: '/tech/android/android-original.svg',
      color: 'from-green-500 to-green-700'
    },

    // Backend Technologies
    { 
      name: 'Node.js', 
      logo: '/tech/nodejs/nodejs-original.svg',
      color: 'from-green-400 to-green-600'
    },
    { 
      name: 'Python', 
      logo: '/tech/python/python-original.svg',
      color: 'from-yellow-400 to-yellow-600'
    },
    { 
      name: 'Java', 
      logo: '/tech/java/java-original.svg',
      color: 'from-red-500 to-red-700'
    },
    { 
      name: 'C#', 
      logo: '/tech/csharp/csharp-original.svg',
      color: 'from-purple-500 to-purple-700'
    },
    { 
      name: 'C++', 
      logo: '/tech/cplusplus/cplusplus-original.svg',
      color: 'from-blue-500 to-blue-700'
    },
    { 
      name: 'Spring', 
      logo: '/tech/spring/spring-original.svg',
      color: 'from-green-500 to-green-700'
    },

    // Databases
    { 
      name: 'MySQL', 
      logo: '/tech/mysql/mysql-original.svg',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      name: 'MongoDB', 
      logo: '/tech/mongodb/mongodb-original.svg',
      color: 'from-green-500 to-green-700'
    },
    { 
      name: 'MariaDB', 
      logo: '/tech/mysql/mysql-original.svg',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      name: 'Oracle', 
      logo: '/tech/oracle/oracle-original.svg',
      color: 'from-red-300 to-red-400'
    },

    // Cloud & DevOps
    { 
      name: 'AWS', 
      logo: '/tech/aws.png',
      color: 'from-orange-400 to-orange-400'
    },
    { 
      name: 'Google Cloud', 
      logo: '/tech/googlecloud/googlecloud-original.svg',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      name: 'Digital Ocean', 
      logo: '/tech/digitalocean/digitalocean-original.svg',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      name: 'Docker', 
      logo: '/tech/docker/docker-original.svg',
      color: 'from-blue-500 to-blue-700'
    },
    { 
      name: 'Kubernetes', 
      logo: '/tech/kubernetes/kubernetes-plain.svg',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      name: 'Jenkins', 
      logo: '/tech/jenkins/jenkins-original.svg',
      color: 'from-red-500 to-red-700'
    },
    { 
      name: 'Terraform', 
      logo: '/tech/terraform/terraform-original.svg',
      color: 'from-purple-500 to-purple-700'
    },
    { 
      name: 'Hadoop', 
      logo: '/tech/hadoop/hadoop-original.svg',
      color: 'from-yellow-500 to-yellow-700'
    }
  ];

const TechStack: React.FC = () => {
  const row = [...TECHNOLOGIES, ...TECHNOLOGIES];
  return (
    <section aria-label="Technologies we use" className="overflow-hidden border-y border-gray-100 bg-white py-10 dark:border-gray-800 dark:bg-gray-900">
      <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        Powering products with modern technology
      </p>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent dark:from-gray-900" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent dark:from-gray-900" aria-hidden="true" />
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused] motion-reduce:animate-none">
          {row.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              aria-hidden={i >= TECHNOLOGIES.length}
              className="flex shrink-0 items-center gap-2.5 rounded-full border border-gray-200 bg-gray-50 py-2 pl-2 pr-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${tech.color} p-1.5`}>
                <img
                  src={tech.logo}
                  alt={i < TECHNOLOGIES.length ? `${tech.name} logo` : ''}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;