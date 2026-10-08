import React, { useEffect, useState } from 'react';

export type TechCategory =
  | 'All'
  | 'Frontend'
  | 'Backend'
  | 'Mobile'
  | 'Database'
  | 'Cloud & DevOps'
  | 'AI & ML';

export interface HomeTech {
  name: string;
  logo: string;
  category: TechCategory;
  accent: string;      // Hover glow + border colour
  bgGradient: string;  // Tint behind the logo
}

/* Inline SVG logos for the AI & ML group (no files to host). Sources: Devicon + LobeHub icons (MIT). Logos are trademarks of their owners. */
const svgUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
const AI_LOGOS = {
  openai: svgUri("<svg fill=\"#10A37F\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z\"></path></svg>"),
  langchain: svgUri("<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7.531 15.976a7.534 7.534 0 000-10.651L2.206 0A7.537 7.537 0 000 5.326c0 1.996.794 3.913 2.206 5.325l5.325 5.325zM18.674 16.469a7.535 7.535 0 00-10.65 0l5.325 5.325a7.536 7.536 0 0010.651 0l-5.326-5.325zM2.218 21.782a7.536 7.536 0 005.326 2.206v-7.531H.012c0 1.996.795 3.914 2.206 5.325zM20.73 8.595a7.534 7.534 0 00-10.651.001l5.325 5.326 5.326-5.327z\" fill=\"#7FC8FF\"></path></svg>"),
  huggingface: svgUri("<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M2.25 11.535c0-3.407 1.847-6.554 4.844-8.258a9.822 9.822 0 019.687 0c2.997 1.704 4.844 4.851 4.844 8.258 0 5.266-4.337 9.535-9.687 9.535S2.25 16.8 2.25 11.535z\" fill=\"#FF9D0B\"></path><path d=\"M11.938 20.086c4.797 0 8.687-3.829 8.687-8.551 0-4.722-3.89-8.55-8.687-8.55-4.798 0-8.688 3.828-8.688 8.55 0 4.722 3.89 8.55 8.688 8.55z\" fill=\"#FFD21E\"></path><path d=\"M11.875 15.113c2.457 0 3.25-2.156 3.25-3.263 0-.576-.393-.394-1.023-.089-.582.283-1.365.675-2.224.675-1.798 0-3.25-1.693-3.25-.586 0 1.107.79 3.263 3.25 3.263h-.003z\" fill=\"#FF323D\"></path><path d=\"M14.76 9.21c.32.108.445.753.767.585.447-.233.707-.708.659-1.204a1.235 1.235 0 00-.879-1.059 1.262 1.262 0 00-1.33.394c-.322.384-.377.92-.14 1.36.153.283.638-.177.925-.079l-.002.003zm-5.887 0c-.32.108-.448.753-.768.585a1.226 1.226 0 01-.658-1.204c.048-.495.395-.913.878-1.059a1.262 1.262 0 011.33.394c.322.384.377.92.14 1.36-.152.283-.64-.177-.925-.079l.003.003zm1.12 5.34a2.166 2.166 0 011.325-1.106c.07-.02.144.06.219.171l.192.306c.069.1.139.175.209.175.074 0 .15-.074.223-.172l.205-.302c.08-.11.157-.188.234-.165.537.168.986.536 1.25 1.026.932-.724 1.275-1.905 1.275-2.633 0-.508-.306-.426-.81-.19l-.616.296c-.52.24-1.148.48-1.824.48-.676 0-1.302-.24-1.823-.48l-.589-.283c-.52-.248-.838-.342-.838.177 0 .703.32 1.831 1.187 2.56l.18.14z\" fill=\"#3A3B45\"></path><path d=\"M17.812 10.366a.806.806 0 00.813-.8c0-.441-.364-.8-.813-.8a.806.806 0 00-.812.8c0 .442.364.8.812.8zm-11.624 0a.806.806 0 00.812-.8c0-.441-.364-.8-.812-.8a.806.806 0 00-.813.8c0 .442.364.8.813.8zM4.515 13.073c-.405 0-.765.162-1.017.46a1.455 1.455 0 00-.333.925 1.801 1.801 0 00-.485-.074c-.387 0-.737.146-.985.409a1.41 1.41 0 00-.2 1.722 1.302 1.302 0 00-.447.694c-.06.222-.12.69.2 1.166a1.267 1.267 0 00-.093 1.236c.238.533.81.958 1.89 1.405l.24.096c.768.3 1.473.492 1.478.494.89.243 1.808.375 2.732.394 1.465 0 2.513-.443 3.115-1.314.93-1.342.842-2.575-.274-3.763l-.151-.154c-.692-.684-1.155-1.69-1.25-1.912-.195-.655-.71-1.383-1.562-1.383-.46.007-.889.233-1.15.605-.25-.31-.495-.553-.715-.694a1.87 1.87 0 00-.993-.312zm14.97 0c.405 0 .767.162 1.017.46.216.262.333.588.333.925.158-.047.322-.071.487-.074.388 0 .738.146.985.409a1.41 1.41 0 01.2 1.722c.22.178.377.422.445.694.06.222.12.69-.2 1.166.244.37.279.836.093 1.236-.238.533-.81.958-1.889 1.405l-.239.096c-.77.3-1.475.492-1.48.494-.89.243-1.808.375-2.732.394-1.465 0-2.513-.443-3.115-1.314-.93-1.342-.842-2.575.274-3.763l.151-.154c.695-.684 1.157-1.69 1.252-1.912.195-.655.708-1.383 1.56-1.383.46.007.889.233 1.15.605.25-.31.495-.553.718-.694.244-.162.523-.265.814-.3l.176-.012z\" fill=\"#FF9D0B\"></path><path d=\"M9.785 20.132c.688-.994.638-1.74-.305-2.667-.945-.928-1.495-2.288-1.495-2.288s-.205-.788-.672-.714c-.468.074-.81 1.25.17 1.971.977.721-.195 1.21-.573.534-.375-.677-1.405-2.416-1.94-2.751-.532-.332-.907-.148-.782.541.125.687 2.357 2.35 2.14 2.707-.218.362-.983-.42-.983-.42S2.953 14.9 2.43 15.46c-.52.558.398 1.026 1.7 1.803 1.308.778 1.41.985 1.225 1.28-.187.295-3.07-2.1-3.34-1.083-.27 1.011 2.943 1.304 2.745 2.006-.2.7-2.265-1.324-2.685-.537-.425.79 2.913 1.718 2.94 1.725 1.075.276 3.813.859 4.77-.522zm4.432 0c-.687-.994-.64-1.74.305-2.667.943-.928 1.493-2.288 1.493-2.288s.205-.788.675-.714c.465.074.807 1.25-.17 1.971-.98.721.195 1.21.57.534.377-.677 1.407-2.416 1.94-2.751.532-.332.91-.148.782.541-.125.687-2.355 2.35-2.137 2.707.215.362.98-.42.98-.42S21.05 14.9 21.57 15.46c.52.558-.395 1.026-1.7 1.803-1.308.778-1.408.985-1.225 1.28.187.295 3.07-2.1 3.34-1.083.27 1.011-2.94 1.304-2.743 2.006.2.7 2.263-1.324 2.685-.537.423.79-2.912 1.718-2.94 1.725-1.077.276-3.815.859-4.77-.522z\" fill=\"#FFD21E\"></path></svg>"),
  tensorflow: svgUri("<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 128 128\"> <path d=\"m61.55 128-21.84-12.68V40.55L6.81 59.56l.08-28.32L61.55 0zM66.46 0v128l21.84-12.68V79.31l16.49 9.53-.1-24.63-16.39-9.36v-14.3l32.89 19.01-.08-28.32z\" fill=\"#ff6f00\" /> </svg>"),
  pytorch: svgUri("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 128 128\"><path fill=\"#EE4C2C\" d=\"M100.1 38.3l-9.2 9.2c15.1 15.1 15.1 39.4 0 54.3-15.1 15.1-39.4 15.1-54.3 0-15.1-15.1-15.1-39.4 0-54.3l24-24 3.4-3.4V2L27.8 38.2C7.7 58.3 7.7 90.8 27.8 111s52.6 20.1 72.4 0c20.1-20.2 20.1-52.5-.1-72.7z\"/><circle fill=\"#EE4C2C\" transform=\"rotate(-88.939 82.069 29.398) scale(.99997)\" cx=\"82.1\" cy=\"29.4\" r=\"6.7\"/></svg>"),
  keras: svgUri("<svg xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" style=\"enable-background:new 0 0 128 128\" viewBox=\"0 0 128 128\"><path d=\"M128 128H0V0h128v128z\" style=\"fill:#d00000\"/><path d=\"M34.1 99.3c0 .1.1.2.1.3l2.2 2.2c.1.1.2.1.3.1h7.5c.1 0 .2-.1.3-.1l2.2-2.2c.1-.1.1-.2.1-.3V75.5c0-.1.1-.2.1-.3l9.5-9.1c.1-.1.2-.1.2 0l24.1 35.6c.1.1.2.1.3.1h10.6c.1 0 .2-.1.3-.2l1.9-3.7v-.3L65.7 56.9c-.1-.1 0-.2 0-.3l25.9-25.8c.1-.1.1-.2.1-.3V30c0-.1 0-.2-.1-.3l-1.5-3.4c0-.1-.1-.2-.2-.2H79.4c-.1 0-.2.1-.3.1L47 58.5c-.1.1-.1 0-.1-.1V28.9c0-.1-.1-.2-.1-.3l-2.2-2.3c-.1-.1-.2-.1-.3-.1h-7.6c-.1 0-.2.1-.3.1l-2.2 2.4c-.1.1-.1.2-.1.3v70.3z\" style=\"fill:#fff\"/></svg>"),
  scikitlearn: svgUri("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 128 128\"><path fill=\"#f89939\" d=\"M98.18 88.13c15.63-15.62 18.23-38.36 5.8-50.78-12.43-12.42-35.17-9.82-50.8 5.8-15.63 15.62-11.11 45.48-5.8 50.78 4.29 4.29 35.17 9.82 50.8-5.8Z\"/><path fill=\"#3499cd\" d=\"M34.04 65.56c-9.07-9.06-22.27-10.57-29.48-3.37-7.21 7.21-5.7 20.4 3.37 29.46 9.07 9.07 26.4 6.44 29.48 3.37 2.49-2.49 5.71-20.4-3.37-29.46Z\"/><path fill=\"#010101\" d=\"M123.82 85.68c-.58 0-.87-.35-.87-1.06 0-.53.35-1.69 1.04-3.46 1.01-2.59 1.52-4.45 1.52-5.58 0-.68-.2-1.25-.6-1.7-.4-.45-.9-.68-1.5-.68-.88 0-1.89.41-3.03 1.24-1.14.83-2.67 2.32-4.6 4.48.28-1.4.88-3.32 1.78-5.76l-4.31.83c-.98 2.12-1.69 4.03-2.13 5.73-.22.83-.38 1.69-.49 2.56-1.35 1.31-2.23 2.1-2.61 2.39-.39.29-.8.43-1.22.43-.39 0-.7-.15-.93-.44-.23-.29-.34-.69-.34-1.18 0-.53.1-1.14.3-1.83s.64-1.99 1.33-3.9l1.64-4.52-1.61.07c-1.46 2.78-3.17 4.28-5.13 4.49.53-1.38.8-2.44.8-3.18 0-.94-.46-1.41-1.38-1.41-1.09 0-1.94.51-2.55 1.54-.62 1.03-.93 2-.93 2.91s.51 1.55 1.52 2c-.66.97-1.4 1.88-2.2 2.74-.95.94-1.69 1.66-2.23 2.13-.55.49-1.06.73-1.52.73-.72 0-1.08-.51-1.08-1.52s.4-2.75 1.2-5.35l1.56-5.18h-.99l-3.61 2c-.59-1.35-1.62-2.03-3.09-2.03-1.17 0-2.51.5-4.03 1.49-1.52.99-2.77 2.28-3.74 3.89-.75 1.24-1.21 2.54-1.38 3.88-1.36 1.36-2.38 2.24-3.06 2.65-.71.42-1.45.63-2.23.63-1.99 0-3.22-1.15-3.69-3.45 5.19-1.52 7.78-3.5 7.78-5.94 0-.92-.33-1.66-.99-2.23-.66-.57-1.54-.85-2.63-.85-2.11 0-4.03 1.01-5.76 3.03-1.57 1.83-2.42 3.86-2.57 6.09-1.43 1.41-2.51 2.34-3.21 2.79-.72.46-1.4.69-2.03.69s-1.13-.3-1.5-.9c-.38-.6-.57-1.41-.57-2.44 0-.46.05-1.3.14-2.53 2.36-2.56 4.09-4.96 5.2-7.21 1.11-2.25 1.66-4.58 1.66-6.98 0-.85-.11-1.52-.33-2.02-.22-.5-.5-.75-.84-.75-.07 0-.18.02-.32.07l-4.49 1.66c-1.53 2.92-2.84 6.11-3.91 9.58-1.07 3.46-1.61 6.43-1.61 8.9 0 1.65.38 2.96 1.16 3.94.77.98 1.79 1.47 3.05 1.47 1.1 0 2.25-.35 3.46-1.05 1.21-.7 2.61-1.79 4.22-3.26s0-.02 0-.02c.19 1.11.65 2.04 1.37 2.8.99 1.02 2.28 1.54 3.88 1.54 1.44 0 2.75-.35 3.94-1.05 1.15-.67 2.44-1.72 3.88-3.11.12 1.04.46 1.94 1.03 2.71.73.97 1.61 1.46 2.64 1.46s2.09-.4 3.09-1.2c1-.8 2.08-2.05 3.26-3.73-.11 3.29.77 4.93 2.63 4.93.74 0 1.52-.27 2.33-.81s2.16-1.71 4.05-3.5c1.64-1.62 2.84-3.14 3.61-4.56 1.04-.18 1.99-.49 2.86-.94-1.78 2.79-2.67 5.02-2.67 6.68 0 .9.25 1.65.74 2.25.49.6 1.1.91 1.82.91 1.57 0 3.8-1.41 6.68-4.2 0 .22-.02.43-.02.65 0 .78.07 1.96.19 3.55l3.91-.92c0-1.06.02-1.9.05-2.53.06-.84.18-1.76.35-2.76.11-.59.38-1.15.81-1.68l.99-1.15c.36-.42.71-.8 1.02-1.13.37-.39.7-.72.99-.99.33-.29.62-.53.87-.69.27-.16.49-.25.65-.25.29 0 .44.19.44.57s-.28 1.26-.83 2.65c-1.04 2.59-1.56 4.52-1.56 5.78 0 .93.24 1.67.73 2.23.48.55 1.12.83 1.91.83 1.94 0 4.28-1.44 7-4.31V82.3c-1.93 2.27-3.32 3.41-4.18 3.41Zm-65.26-8.29c.8-3.91 1.62-6.94 2.45-9.11.83-2.17 1.47-3.26 1.9-3.26.2 0 .37.13.5.4.13.26.19.62.19 1.05 0 1.49-.46 3.26-1.4 5.33-.93 2.06-2.15 3.93-3.64 5.59Zm11.79-.98c.71-1.19 1.45-1.78 2.23-1.78.82 0 1.24.57 1.24 1.7 0 2.29-1.51 3.85-4.53 4.7 0-1.9.35-3.44 1.06-4.62Zm17.48 5.85c-1.04 2.01-2.16 3.01-3.33 3.01-.48 0-.88-.2-1.19-.59-.31-.39-.47-.91-.47-1.55 0-1.68.53-3.53 1.58-5.53 1.05-2 2.17-3 3.35-3 .49 0 .89.18 1.18.56.29.37.44.89.44 1.55 0 1.7-.52 3.55-1.56 5.56Z\"/><path fill=\"#fff\" d=\"M75.46 64.88c.15.21.22.48.22.8s-.09.61-.27.88-.44.49-.79.64c-.34.15-.73.23-1.16.23-.72 0-1.26-.15-1.64-.45s-.62-.74-.72-1.33l.93-.15c.05.37.2.66.43.85.24.2.57.3 1 .3s.75-.09.96-.26c.21-.17.31-.38.31-.62 0-.21-.09-.38-.28-.5-.13-.08-.45-.19-.96-.32-.69-.17-1.16-.32-1.43-.45s-.47-.3-.6-.53-.21-.47-.21-.74c0-.25.06-.47.17-.68.11-.21.27-.38.46-.52.15-.11.34-.2.59-.27.25-.07.52-.11.81-.11.43 0 .81.06 1.14.19.33.12.57.29.73.51.16.21.26.5.32.86l-.92.12c-.04-.28-.16-.51-.36-.67-.2-.16-.48-.24-.85-.24-.43 0-.74.07-.92.21-.18.14-.28.31-.28.5 0 .12.04.23.11.33.08.1.2.18.36.25.09.03.37.11.83.24.66.18 1.12.32 1.39.43.26.11.47.28.62.49Zm4.47 1.44c-.25.23-.55.34-.92.34-.46 0-.83-.17-1.11-.5s-.43-.88-.43-1.62.15-1.27.44-1.6.68-.51 1.15-.51c.31 0 .58.09.8.28.22.19.37.47.46.84l.91-.14c-.11-.56-.35-.99-.73-1.29-.38-.3-.87-.45-1.47-.45-.48 0-.91.11-1.32.34-.4.22-.71.56-.9 1.01-.2.45-.3.97-.3 1.57 0 .92.23 1.63.69 2.12.46.49 1.07.74 1.82.74.6 0 1.11-.18 1.53-.54.41-.36.67-.86.77-1.49l-.92-.12c-.07.47-.22.81-.47 1.04Zm2.19.98h.94v-5.52h-.94v5.52Zm0-6.55h.94v-1.08h-.94v1.08Zm6.73 1.02h-1.21l-2.22 2.25v-4.35h-.94v7.62h.94V65.1l.66-.63 1.83 2.82h1.16l-2.33-3.47 2.11-2.05Zm.96-1.02h.94v-1.08h-.94v1.08Zm0 6.55h.94v-5.52h-.94v5.52Zm4.41-.84c-.17.02-.31.04-.41.04-.14 0-.25-.02-.32-.07s-.13-.11-.16-.18c-.03-.08-.05-.25-.05-.51v-3.23h.94v-.73h-.94v-1.93l-.93.56v1.37h-.69v.73h.69v3.18c0 .56.04.93.11 1.1.08.18.21.32.39.42.19.11.45.16.79.16.21 0 .44-.03.71-.08l-.14-.83Z\"/></svg>"),
  opencv: svgUri("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 128 128\"><path d=\"M112.871 66.602c9.004 5.277 15.055 15.027 15.074 26.191.032 16.805-13.617 30.453-30.48 30.48-16.863.032-30.559-13.57-30.59-30.375-.02-11.164 5.996-20.933 14.984-26.246l8.774 14.778c.219.37.094.847-.262 1.09-3.32 2.25-5.496 6.046-5.488 10.347.012 6.895 5.633 12.477 12.55 12.461 6.919-.012 12.516-5.61 12.504-12.504-.007-4.3-2.195-8.09-5.523-10.328-.355-.242-.484-.719-.266-1.09zm0 0\" fill=\"#128dff\"/><path d=\"M45.477 66.422a30.495 30.495 0 00-14.907-3.867C13.703 62.555.035 76.18.035 92.985c0 16.804 13.668 30.43 30.535 30.43 16.946 0 30.95-14.337 30.524-31.212H43.906c-.453 0-.808.383-.812.832-.043 6.723-5.672 12.434-12.524 12.434-6.922 0-12.527-5.59-12.527-12.485 0-6.894 5.605-12.484 12.527-12.484 1.809 0 3.532.383 5.086 1.074.383.168.836.04 1.047-.316zm0 0\" fill=\"#8bda67\"/><path d=\"M47.945 61.648c-8.992-5.293-15.027-15.054-15.027-26.218C32.918 18.625 46.59 5 63.453 5s30.535 13.625 30.535 30.43c0 11.164-6.035 20.925-15.027 26.218L70.21 46.86c-.219-.37-.094-.847.266-1.09 3.32-2.246 5.503-6.039 5.503-10.34 0-6.894-5.609-12.484-12.527-12.484-6.918 0-12.527 5.59-12.527 12.485 0 4.3 2.183 8.093 5.504 10.34.36.242.484.718.265 1.09zm0 0\" fill=\"#ff2a44\"/></svg>"),
  pandas: svgUri("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 128 128\"><path fill=\"#130754\" d=\"M46.236 7.567h13.99v29.047h-13.99Zm0 59.668h13.99V96.28h-13.99Z\"/><path fill=\"#ffca00\" d=\"M46.236 45.092h13.99v13.705h-13.99Z\"/><path fill=\"#130754\" d=\"M23.763 31.446h13.989V128h-13.99ZM68.245 91.2h13.99v29.046h-13.99Zm0-59.72h13.99v29.047h-13.99Z\"/><path fill=\"#e70488\" d=\"M68.245 69.011h13.99v13.705h-13.99Z\"/><path fill=\"#130754\" d=\"M90.248 0h13.99v96.554h-13.99Z\"/></svg>"),
};

export const TECHNOLOGIES: HomeTech[] = [
  // Frontend
  { name: 'React', logo: '/tech/react/react-original.svg', category: 'Frontend', accent: '#61DAFB', bgGradient: 'from-cyan-500/20 to-blue-600/20' },
  { name: 'Next.js', logo: '/tech/nextjs/nextjs-original.svg', category: 'Frontend', accent: '#71717A', bgGradient: 'from-zinc-400/20 to-zinc-700/20' },
  { name: 'Vue.js', logo: '/tech/vuejs/vuejs-original.svg', category: 'Frontend', accent: '#42B883', bgGradient: 'from-emerald-500/20 to-green-600/20' },
  { name: 'Angular', logo: '/tech/angularjs/angularjs-original.svg', category: 'Frontend', accent: '#DD0031', bgGradient: 'from-red-500/20 to-rose-700/20' },
  { name: 'JavaScript', logo: '/tech/javascript/javascript-original.svg', category: 'Frontend', accent: '#F7DF1E', bgGradient: 'from-yellow-400/20 to-amber-600/20' },
  { name: 'HTML5', logo: '/tech/html5/html5-original.svg', category: 'Frontend', accent: '#E34F26', bgGradient: 'from-orange-500/20 to-red-600/20' },
  { name: 'CSS3', logo: '/tech/css3/css3-original.svg', category: 'Frontend', accent: '#1572B6', bgGradient: 'from-blue-500/20 to-indigo-600/20' },

  // Mobile
  { name: 'React Native', logo: '/tech/react/react-original.svg', category: 'Mobile', accent: '#61DAFB', bgGradient: 'from-cyan-500/20 to-blue-600/20' },
  { name: 'iOS', logo: '/tech/apple/apple-original.svg', category: 'Mobile', accent: '#A2AAAD', bgGradient: 'from-gray-400/20 to-slate-600/20' },
  { name: 'Android', logo: '/tech/android/android-original.svg', category: 'Mobile', accent: '#3DDC84', bgGradient: 'from-emerald-400/20 to-green-600/20' },

  // Backend
  { name: 'Node.js', logo: '/tech/nodejs/nodejs-original.svg', category: 'Backend', accent: '#68A063', bgGradient: 'from-green-500/20 to-emerald-700/20' },
  { name: 'Python', logo: '/tech/python/python-original.svg', category: 'Backend', accent: '#3776AB', bgGradient: 'from-blue-500/20 to-amber-500/20' },
  { name: 'Java', logo: '/tech/java/java-original.svg', category: 'Backend', accent: '#EA2D2E', bgGradient: 'from-red-500/20 to-amber-600/20' },
  { name: 'C#', logo: '/tech/csharp/csharp-original.svg', category: 'Backend', accent: '#239120', bgGradient: 'from-purple-500/20 to-violet-700/20' },
  { name: 'C++', logo: '/tech/cplusplus/cplusplus-original.svg', category: 'Backend', accent: '#00599C', bgGradient: 'from-blue-500/20 to-indigo-700/20' },
  { name: 'Spring', logo: '/tech/spring/spring-original.svg', category: 'Backend', accent: '#6DB33F', bgGradient: 'from-green-400/20 to-emerald-700/20' },

  // Database
  { name: 'MySQL', logo: '/tech/mysql/mysql-original.svg', category: 'Database', accent: '#4479A1', bgGradient: 'from-blue-500/20 to-amber-600/20' },
  { name: 'MongoDB', logo: '/tech/mongodb/mongodb-original.svg', category: 'Database', accent: '#47A248', bgGradient: 'from-emerald-500/20 to-green-700/20' },
  { name: 'Oracle', logo: '/tech/oracle/oracle-original.svg', category: 'Database', accent: '#F80000', bgGradient: 'from-red-500/20 to-rose-700/20' },

  // Cloud & DevOps
  { name: 'AWS', logo: '/tech/aws.png', category: 'Cloud & DevOps', accent: '#FF9900', bgGradient: 'from-amber-500/20 to-orange-600/20' },
  { name: 'Google Cloud', logo: '/tech/googlecloud/googlecloud-original.svg', category: 'Cloud & DevOps', accent: '#4285F4', bgGradient: 'from-blue-500/20 to-red-500/20' },
  { name: 'Docker', logo: '/tech/docker/docker-original.svg', category: 'Cloud & DevOps', accent: '#2496ED', bgGradient: 'from-sky-500/20 to-blue-700/20' },
  { name: 'Kubernetes', logo: '/tech/kubernetes/kubernetes-plain.svg', category: 'Cloud & DevOps', accent: '#326CE5', bgGradient: 'from-blue-600/20 to-indigo-700/20' },
  { name: 'Terraform', logo: '/tech/terraform/terraform-original.svg', category: 'Cloud & DevOps', accent: '#844FBA', bgGradient: 'from-purple-500/20 to-violet-800/20' },

  // AI & ML
  { name: 'OpenAI', logo: AI_LOGOS.openai, category: 'AI & ML', accent: '#10A37F', bgGradient: 'from-emerald-500/20 to-teal-600/20' },
  { name: 'LangChain', logo: AI_LOGOS.langchain, category: 'AI & ML', accent: '#1C7C54', bgGradient: 'from-green-500/20 to-emerald-700/20' },
  { name: 'Hugging Face', logo: AI_LOGOS.huggingface, category: 'AI & ML', accent: '#FFD21E', bgGradient: 'from-yellow-400/20 to-amber-500/20' },
  { name: 'TensorFlow', logo: AI_LOGOS.tensorflow, category: 'AI & ML', accent: '#FF6F00', bgGradient: 'from-orange-500/20 to-amber-600/20' },
  { name: 'PyTorch', logo: AI_LOGOS.pytorch, category: 'AI & ML', accent: '#EE4C2C', bgGradient: 'from-orange-500/20 to-red-600/20' },
  { name: 'Keras', logo: AI_LOGOS.keras, category: 'AI & ML', accent: '#D00000', bgGradient: 'from-red-500/20 to-rose-700/20' },
  { name: 'scikit-learn', logo: AI_LOGOS.scikitlearn, category: 'AI & ML', accent: '#F7931E', bgGradient: 'from-orange-400/20 to-blue-500/20' },
  { name: 'OpenCV', logo: AI_LOGOS.opencv, category: 'AI & ML', accent: '#5C3EE8', bgGradient: 'from-indigo-500/20 to-violet-600/20' },
  { name: 'Pandas', logo: AI_LOGOS.pandas, category: 'AI & ML', accent: '#E70488', bgGradient: 'from-pink-500/20 to-indigo-700/20' },
];

const CATEGORIES: TechCategory[] = ['All', 'Frontend', 'Backend', 'Mobile', 'Database', 'Cloud & DevOps', 'AI & ML'];

/* Self-contained CSS: no tailwind.config animation entries needed. */
const STYLES = `
@keyframes ts-left  { from { transform: translateX(0) }    to { transform: translateX(-50%) } }
@keyframes ts-right { from { transform: translateX(-50%) } to { transform: translateX(0) } }
@keyframes ts-pop   { from { opacity: 0; transform: translateY(12px) scale(.97) } to { opacity: 1; transform: none } }

.ts-track        { animation: ts-left var(--ts-dur, 50s) linear infinite; will-change: transform; }
.ts-track.ts-rev { animation-name: ts-right; }
.ts-row:hover .ts-track,
.ts-row:active .ts-track { animation-play-state: paused; }

.ts-mask {
  -webkit-mask-image: linear-gradient(to right, transparent, #000 9%, #000 91%, transparent);
          mask-image: linear-gradient(to right, transparent, #000 9%, #000 91%, transparent);
}

.ts-card { transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
.ts-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--accent) 60%, transparent);
  box-shadow: 0 14px 32px -12px color-mix(in srgb, var(--accent) 55%, transparent);
}
.ts-pop { animation: ts-pop .5s cubic-bezier(.2,.7,.2,1) both; }

@media (prefers-reduced-motion: reduce) {
  .ts-track { animation: none; }
  .ts-pop   { animation: none; }
  .ts-card, .ts-card:hover { transition: none; transform: none; }
}
`;

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */
const TechCard: React.FC<{
  tech: HomeTech;
  decorative?: boolean;
  popIndex?: number;
}> = ({ tech, decorative, popIndex }) => {
  const [logoFailed, setLogoFailed] = useState(false);
  return (
  <li
    aria-hidden={decorative || undefined}
    className={`ts-card relative flex shrink-0 list-none items-center gap-3.5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 px-3.5 py-3 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70 sm:px-4 ${
      popIndex !== undefined ? 'ts-pop' : ''
    }`}
    style={{
      ['--accent' as string]: tech.accent,
      ...(popIndex !== undefined ? { animationDelay: `${Math.min(popIndex, 15) * 40}ms` } : {}),
    }}
  >
    {/* Logo chip: white base keeps dark logos (Next.js, Apple) visible in dark mode */}
    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-slate-200/70 dark:ring-white/10">
      <span aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${tech.bgGradient}`} />
      {logoFailed ? (
        <span aria-hidden="true" className="relative text-sm font-bold" style={{ color: tech.accent }}>
          {tech.name.charAt(0)}
        </span>
      ) : (
        <img
          src={tech.logo}
          alt={decorative ? '' : `${tech.name} logo`}
          loading="lazy"
          decoding="async"
          onError={() => setLogoFailed(true)}
          className="relative h-6 w-6 object-contain sm:h-7 sm:w-7"
        />
      )}
    </span>

    <span className="flex flex-col pr-1 text-left">
      <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">
        {tech.name}
      </span>
      <span className="whitespace-nowrap text-[11px] font-medium text-slate-400 dark:text-slate-500">
        {tech.category}
      </span>
    </span>

    <span
      aria-hidden="true"
      className="ml-auto h-1.5 w-1.5 rounded-full opacity-60"
      style={{ backgroundColor: tech.accent }}
    />
  </li>
  );
};

/* ------------------------------------------------------------------ */
/*  Marquee row (seamless loop, always wide enough to fill the screen) */
/* ------------------------------------------------------------------ */
const MarqueeRow: React.FC<{ items: HomeTech[]; reverse?: boolean; label: string }> = ({
  items,
  reverse,
  label,
}) => {
  // Repeat short lists so one group is always wider than a large screen.
  const reps = Math.max(1, Math.ceil(14 / items.length));
  const base = Array.from({ length: reps }).flatMap(() => items);
  const duration = Math.max(30, base.length * 3.4); // ~constant speed regardless of filter

  const group = (dup: boolean) => (
    <ul
      aria-hidden={dup || undefined}
      aria-label={dup ? undefined : label}
      className="m-0 flex shrink-0 gap-3 p-0 py-3 pr-3 sm:gap-4 sm:pr-4"
    >
      {base.map((t, i) => (
        <TechCard key={`${t.name}-${i}`} tech={t} decorative={dup || i >= items.length} />
      ))}
    </ul>
  );

  return (
    <div className="ts-row ts-mask overflow-hidden">
      <div
        className={`ts-track flex w-max ${reverse ? 'ts-rev' : ''}`}
        style={{ ['--ts-dur' as string]: `${duration}s` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export const TechStack: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TechCategory>('All');
  const [viewMode, setViewMode] = useState<'marquee' | 'grid'>('marquee');

  // People who prefer reduced motion start on the static grid.
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) setViewMode('grid');
  }, []);

  const filteredTech =
    activeTab === 'All' ? TECHNOLOGIES : TECHNOLOGIES.filter((t) => t.category === activeTab);

  const twoRows = filteredTech.length >= 6;
  const half = twoRows ? Math.ceil(filteredTech.length / 2) : filteredTech.length;
  const row1 = filteredTech.slice(0, half);
  const row2 = filteredTech.slice(half);

  const pill = (active: boolean) =>
    `rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
      active
        ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
    }`;

  const seg = (active: boolean) =>
    `rounded-lg px-3 py-1 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500 ${
      active
        ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
    }`;

  return (
    <section
      aria-label="Technologies we use"
      className="relative w-full overflow-hidden border-y border-slate-200/60 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 py-14 dark:border-slate-800/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:py-16"
    >
      <style>{STYLES}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-indigo-500/10 via-sky-500/10 to-teal-500/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-50/60 px-3 py-1 text-xs font-semibold text-sky-600 backdrop-blur-sm dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500 motion-safe:animate-pulse" />
            Modern Ecosystem
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Engineered with industry-standard stacks
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            High performance, enterprise-grade architecture powering every tier of the product.
          </p>
        </div>

        {/* Controls */}
        <div className="mt-8 flex flex-col gap-4 border-b border-slate-200/60 pb-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
          {/* Scrolls sideways on narrow phones instead of wrapping into 3 rows */}
          <div
            role="group"
            aria-label="Filter by category"
            className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={activeTab === cat}
                onClick={() => setActiveTab(cat)}
                className={`${pill(activeTab === cat)} shrink-0`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div
            role="group"
            aria-label="Layout"
            className="flex w-fit items-center gap-1 self-start rounded-xl border border-slate-200 bg-slate-100/70 p-1 text-xs dark:border-slate-800 dark:bg-slate-800/80 md:self-auto"
          >
            <button type="button" aria-pressed={viewMode === 'marquee'} onClick={() => setViewMode('marquee')} className={seg(viewMode === 'marquee')}>
              Stream
            </button>
            <button type="button" aria-pressed={viewMode === 'grid'} onClick={() => setViewMode('grid')} className={seg(viewMode === 'grid')}>
              All Grid
            </button>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {filteredTech.length} technologies
        </p>
      </div>

      {/* Showcase. key= restarts the animation cleanly when the filter or layout changes */}
      <div className="relative mt-6">
        {viewMode === 'marquee' ? (
          <div key={`m-${activeTab}`} className="flex flex-col gap-1">
            <MarqueeRow items={row1} label={`${activeTab} technologies`} />
            {row2.length > 0 && <MarqueeRow items={row2} reverse label={`More ${activeTab} technologies`} />}
          </div>
        ) : (
          <div key={`g-${activeTab}`} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ul
              aria-label={`${activeTab} technologies`}
              className="m-0 grid list-none grid-cols-1 gap-3 p-0 min-[420px]:grid-cols-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5"
            >
              {filteredTech.map((tech, i) => (
                <TechCard key={tech.name} tech={tech} popIndex={i} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default TechStack;