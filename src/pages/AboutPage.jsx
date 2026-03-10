import { useState } from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const [activeValue, setActiveValue] = useState(null);

  const missionTaglines = [
    "Where lived experience leads, and a stronger disability services grows from the ground up.",
    "Many voices, one community — reshaping the disability services with heart, dignity, and unity.",
    "Rooted in lived experience, rising together to shape a better disability services.",
    "When people and providers stand together, the whole sector rises.",
    "A community of voices becoming the change the disability services was meant to hold.",
    "Where connection becomes strength, and strength becomes collective change.",
    "Lived experience at the centre, community at the heart, change from the ground up.",
    "Together, we grow the disability services into the community it was always meant to be.",
    "Uniting voices, lifting standards, and shaping the future — together."
  ];

  const visionPoints = [
    {
      icon: '🤝',
      title: 'Providers Support Each Other',
      description: 'Collaboration becomes the norm, not the exception.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: '🔍',
      title: 'Easy Access to Trusted Services',
      description: 'Real choice and control are strengthened through genuine, transparent connections.',
      color: 'from-green-500 to-teal-600',
    },
    {
      icon: '🌱',
      title: 'Local Relationships Valued',
      description: 'Communities thrive when people know, trust, and support one another.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: '✨',
      title: 'Trust & Transparency First',
      description: 'We prioritise integrity, lived experience, and the voices of people with disability.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: '💪',
      title: 'Connected & Empowered',
      description: 'Everyone deserves access to clear information, respectful support, and a community that listens.',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: '🤝',
      title: 'Community-Driven Support',
      description: 'The disability services remains community-driven and sustainable We work together to advocate for fair, ethical, and accessible systems that support both participants and local providers to thrive.',
      color: 'from-orange-500 to-blue-600',
    },
  ];

  const whyDifferent = [
    {
      number: '01',
      title: 'Led by Disabled People — Not Corporations',
      description: 'Most platforms are built about disabled people. Ours is built by disabled people. Lived experience shapes every decision, every feature, every connection.',
      icon: '👥',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      number: '02',
      title: 'Community First, Not Profit First',
      description: 'We prioritise connection, safety, and transparency over sales funnels and corporate metrics. Our model is built to strengthen the community — not extract from it.',
      icon: '❤️',
      color: 'from-pink-500 to-rose-600',
    },
    {
      number: '03',
      title: 'Ground-Up Approach, Not Top-Down System',
      description: 'We don\'t impose solutions from above. We listen to the community, respond to real needs, and build tools that reflect the lived realities of participants, families, and small providers.',
      icon: '🌱',
      color: 'from-green-500 to-teal-600',
    },
    {
      number: '04',
      title: 'Participants and Providers Meet as Equals',
      description: 'Most platforms separate the two. We bring them together — safely, ethically, and with clear boundaries — because real change happens when everyone is in the same room.',
      icon: '🤝',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      number: '05',
      title: 'Support Beyond Services',
      description: 'We don\'t just help people Participantss. We help them understand the disability services, navigate reviews, access advocacy, and feel confident in their rights. We also help providers grow ethically, connect locally, and build sustainable businesses.',
      icon: '🎯',
      color: 'from-orange-500 to-amber-600',
    },
    {
      number: '06',
      title: 'Transparency and Accountability at the Core',
      description: 'We are building a culture where honesty is standard, not optional. Where whistleblowing is respected. Where poor practice is challenged. Where community safety comes before convenience.',
      icon: '🔍',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      number: '07',
      title: 'A "No One Left Behind" Model',
      description: 'Our platform ensures that disabled people lead the conversation, lived experience is treated as expertise, community replaces isolation, support is accessible at every level, and no one navigates the system alone.',
      icon: '🌟',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      number: '08',
      title: 'Local, Relationship-Driven, Not Just Digital',
      description: 'We focus on building local networks, peer support, and in-person connections — not just clicks and profiles — so people can find real community, not just services.',
      icon: '👥',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      number: '09',
      title: 'Advocacy as a Core Function, Not an Add-On',
      description: 'We don’t sit on the sidelines. We organise, amplify community voices, and engage with government and systems so that policies, pricing, and practices reflect what disabled people and small providers actually need..',
      icon: '💎',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const collectiveVoicePoints = [
    'Protecting real choice and control for participants',
    'Supporting local providers who deliver genuine value',
    'Advocating for fair conditions that allow small businesses to thrive',
    'Engaging with government to ensure the disability services remains accessible, ethical, and community-driven',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-block mb-4">
            <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
              🌟 About Better Together Network
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Reimagining Disability
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
              With the Power of Local Community
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-4xl mx-auto leading-relaxed">
Building Stronger Communities — Together          </p>

          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              We are an independent disability-sector community platform designed to bring people together — providers, participants,
              families, and local specialists — to create stronger, more connected, and more supportive disability networks
              across Australia.
            </p>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Our Leadership</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Meet the Women Leading This Movement
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Driven by lived experience, shaped by decades of advocacy, and committed to transforming the disability sector
            </p>
          </div>

        
{/* Karen Burgess */}
<div>
  <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100">
    <div className="md:flex">
      <div className="md:w-[35%] bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 p-12 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="w-44 h-44 mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/20">
            <img src="/uploads/karen02.jpg" alt="Karen Burgess" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">Karen Burgess</h3>
          <p className="text-blue-200 text-sm font-semibold tracking-widest uppercase mt-1">FIML</p>
          <div className="w-12 h-0.5 bg-blue-300/50 mx-auto my-3"></div>
          <p className="text-blue-100 font-medium">Business Development Manager</p>
          <p className="text-blue-200/80 text-sm mt-1">NDIS Community Founder</p>
        </div>
      </div>

      <div className="md:w-[65%] p-10 md:p-12">
        <div className="max-w-none space-y-5">
          <p className="text-[17px] text-gray-600 leading-relaxed">
           Karen Burgess is an accomplished disability sector leader, reform advocate, and nationally recognised voice for rights‑based, ethical practice across Australia’s complex care systems. With more than three decades of experience spanning disability, community services, and systems reform, she brings a rare combination of lived experience, strategic capability, and deep operational insight to every space she enters.
          </p>

          <p className="text-[17px] text-gray-600 leading-relaxed">
          As a proudly disabled and openly dyslexic professional, Karen has built her career on transforming personal experience into leadership. Her dyslexia has shaped her commitment to accessible communication, inclusive practice, and the recognition of diverse cognitive strengths within organisations and service environments. She is widely respected for her ability to translate complex policy into clear, practical language that empowers both participants and providers to navigate disability supports with confidence.
          </p>

          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border-l-4 border-indigo-500">
            <p className="text-[17px] text-gray-700">
             Karen holds a Master of Business Leadership from Charles Sturt University and is a Fellow of the Institute of Managers and Leaders (FIML) — recognition reserved for senior leaders who demonstrate excellence in governance, strategic leadership, and ethical practice. Her academic and professional background enables her to bridge the gap between policy intent, operational reality, and participant experience.
            </p>
          </div>

          <p className="text-[17px] text-gray-600 leading-relaxed">
          Her leadership has been acknowledged through multiple award nominations, including recognition for community impact, sector leadership, and contributions to disability reform. Karen is also a sought‑after speaker and panelist, known for her clarity, integrity, and ability to challenge systemic barriers while centring lived experience in every conversation.
          <br></br>
          Throughout her career, Karen has been a strong advocate for transparency, accountability, and participant safety. She has acted as a whistleblower when required, demonstrating courage and integrity in calling out practices that compromise dignity, rights, or ethical standards. Her approach is principled, collaborative, and grounded in the belief that meaningful reform must be shaped by the people most affected by it.
          </p>

          <p className="text-[17px] text-gray-600 leading-relaxed">
Karen’s work spans community mobilisation, sector education, and systems improvement. She is deeply committed to elevating the voices of people with disability, strengthening small providers, and promoting a sector culture that values lived experience as expertise.          </p>

          <p className="text-[17px] text-gray-600 leading-relaxed">
Karen Burgess remains a respected and influential voice in the disability community — a leader who brings clarity, courage, and lived experience to every room, every conversation, and every reform effort she touches.          </p>

          <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-500 rounded-2xl p-7 text-white shadow-lg shadow-indigo-200">
            <div className="flex items-start gap-3">
              <svg className="w-8 h-8 text-indigo-200 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-lg font-medium italic leading-relaxed">
                We are bridging the gaps and responding to change by bringing people together to grow this
                community and lead with the strength of disabled experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


{/* Sue Dymond */}
<div className="mb-16">
  <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100">
    <div className="md:flex">
      <div className="md:w-[35%] bg-gradient-to-br from-purple-700 via-purple-600 to-pink-500 p-12 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white rounded-full -translate-x-1/3 translate-y-1/3"></div>
        </div>
        <div className="text-center relative z-10">
        <div className="w-44 h-44 mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/20">
            <img src="/uploads/Sue.jpg" alt="Sue Dymond" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">Sue Dymond</h3>
          <div className="w-12 h-0.5 bg-purple-300/50 mx-auto my-3"></div>
          <p className="text-purple-100 font-medium">Founder & Community Leader</p>
          <p className="text-purple-200/80 text-sm mt-1">SD Connect</p>
        </div>
      </div>

      <div className="md:w-[65%] p-10 md:p-12">
        <div className="max-w-none space-y-5">
          <p className="text-[17px] text-gray-600 leading-relaxed">
            Sue Dymond is a powerhouse of lived experience, advocacy, and community leadership — and a driving
            force behind this platform. Her work is shaped by decades of navigating disability, raising a child
            with Down syndrome, and supporting families who often feel unheard, overwhelmed, or left behind by the system.
          </p>

          <p className="text-[17px] text-gray-600 leading-relaxed">
            Sue's journey has never been theoretical. It has been lived — deeply, personally, and courageously.
            From the early challenges of raising her son to becoming a mentor, author, advocate, and founder of
            SD Connect, she has transformed her experiences into a mission to educate, empower, and unite people
            across the disability community.
          </p>

          <p className="text-[17px] text-gray-600 leading-relaxed">
            Her work spans councils, disability organisations, community groups, and families across Victoria,
            where she has consistently challenged outdated thinking, inspired new perspectives, and pushed for
            genuine inclusion and respect. She is known for her honesty, her humour, and her unwavering belief
            that real change begins with real people coming together.
          </p>

          <p className="text-[17px] text-gray-600 leading-relaxed">
            Sue's lived experience is not just part of her story — it is the foundation of her leadership.
            She understands the gaps, the frustrations, and the emotional weight families carry because she
            has lived it. She also understands the potential of the disability services when community, providers, and
            participants work together with integrity and heart.
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-l-4 border-purple-500">
            <p className="text-[17px] text-gray-700 italic mb-4 font-medium">
              This platform reflects Sue's vision:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-gray-700 text-[17px]">A community where lived experience leads</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-gray-700 text-[17px]">Where providers and participants stand side by side</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-gray-700 text-[17px]">And where quality, connection, and humanity rise from the ground up</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-purple-600 via-purple-600 to-pink-500 rounded-2xl p-7 text-white shadow-lg shadow-purple-200">
            <div className="flex items-start gap-3">
              <svg className="w-8 h-8 text-purple-200 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-lg font-medium italic leading-relaxed">
                It only takes one person to spark change — but when a community stands together,
                transformation becomes unstoppable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

        </div>
      </section>
      {/* Our Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">About Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Strengthen and Drive the Disability Sector
            </h2>
          </div>

          <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-10 border border-purple-200">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
Better Together Network strengthens and drives the disability sector by fostering genuine connection, collaboration and community — one local relationship at a time. We bring together providers across the ecosystem, including intermediary services and organisations that offer supports to disability services, so that everyone working alongside disabled people is connected, informed and aligned in quality, ethical practice.
We believe that better care and support for disabled people should be shaped and guided by disabled people themselves — with provider practices, community spaces and sector standards built through authentic co‑design and the core principle “nothing about us without us.” People with disability are leaders, designers and experts in their own lives; their lived experience must inform how providers operate, how communities connect and how systems evolve.<br/><br/>
By empowering participants, supporting local providers and intermediaries, and amplifying lived experience, Better Together Network builds an ethical, inclusive, community‑driven ecosystem where real choice and control are protected, local businesses are valued, and smaller providers gain the strength of a unified voice to advocate for fair, sustainable conditions and quality practice.                 </p>


            </div>

            {/* Mission in Action */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-10 border border-green-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-4xl mr-4">🎯</span>
                Our Mission in Action
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                By empowering participants, supporting local providers and amplifying lived experience, we aim to build a support ecosystem that is ethical, inclusive and genuinely community-driven — a place where real choice and control are
                protected, local businesses are valued, and smaller providers have the strength of a unified voice to advocate
                for fair, sustainable conditions.
              </p>
            </div>

          

            {/* Mission Statement */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 text-white text-center">
              <p className="text-2xl md:text-3xl font-bold leading-relaxed">
                To build a connected, Supportive Community where people, providers and local networks grow stronger together —
                and where the sector is shaped by the very people it exists to serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Taglines */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission, Many Voices</h2>
            <p className="text-xl text-gray-600">Different perspectives, one unified purpose</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missionTaglines.map((tagline, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed italic">"{tagline}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">Our Vision</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              A Connected, Local, Inclusive disability services Community
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              We are creating a community where no one stands alone — not providers, not participants, not families.
              A community where connection replaces isolation, and collaboration replaces competition.
            </p>
          </div>

          {/* Vision Points */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {visionPoints.map((point, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`bg-gradient-to-br ${point.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                  {point.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{point.title}</h3>
                <p className="text-gray-600 leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>

          {/* Collective Voice */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-10 border border-indigo-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              A Stronger Collective Voice
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center max-w-4xl mx-auto">
              We are coming together as smaller, local groups to become a <strong>stronger collective voice</strong>:
            </p>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {collectiveVoicePoints.map((point, index) => (
                <div key={index} className="flex items-start bg-white rounded-xl p-4 shadow-sm">
                  <svg className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vision Statement */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-10 text-white max-w-4xl">
              <p className="text-2xl md:text-3xl font-bold leading-relaxed">
                Our vision is simple: a connected disability services ecosystem where people, providers, and communities grow stronger together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider">What Makes Us Different</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Why We're Different from Anything Else in the Marketplace
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              We are not another directory, not another provider group, and not another disability services service platform.
              We are building something fundamentally different — a community-driven, lived-experience-led ecosystem
              designed to shift the culture of disability support in Australia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyDifferent.map((item, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-transparent overflow-hidden"
              >
                {/* Number badge */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-lg">{item.number}</span>
                </div>

                <div className={`bg-gradient-to-br ${item.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 pr-12">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Not a Marketplace */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl px-12 py-6 text-white">
              <p className="text-3xl md:text-4xl font-bold mb-2">This is not a marketplace.</p>
              <p className="text-3xl md:text-4xl font-bold">It's a movement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* No One Left Behind Model */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Our Model</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Building a Future Where No One Is Left Behind
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powered by Lived Experience
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-10 border-2 border-purple-200 mb-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Our <em>No One Left Behind</em> model is driven by women with disabilities whose lived experience shapes
                every decision, every connection, and every part of this community. This platform is built on the belief
                that real change happens when those who have walked the path lead the way — when women who have navigated
                the system, challenged its gaps, and carried its weight stand at the centre of reform.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We honour the leadership, insight, and resilience of disabled women who have long been the quiet backbone
                of advocacy, care, and community building. Their lived experience is not symbolic — it is the engine of
                this platform. It guides how we connect people, how we support families, how we hold providers accountable,
                and how we build a sector where no one is left behind.
              </p>
            </div>
          </div>

          {/* Model Ensures */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Disabled people lead the conversation, break new ground, and reimagine disability in Australia',
              'Lived experience is recognised as expertise, not an afterthought',
              'Community connection replaces isolation',
              'Support is accessible at every level, regardless of circumstance',
              'No participant, family, or provider is left to navigate the system alone',
              'Trust, transparency, and safety are non-negotiable foundations for every interaction and decision'

            ].map((item, index) => (
              <div key={index} className="flex items-start bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <svg className="w-6 h-6 text-purple-600 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          {/* Leadership Statement */}
          <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 text-white text-center">
            <p className="text-2xl md:text-3xl font-bold leading-relaxed mb-6">
              By centring disabled women's leadership, we create a community that is stronger, more honest,
              and more deeply connected — a community where everyone has a place, a voice, and a pathway forward.
            </p>
            <p className="text-xl font-semibold">
              Ensuring the voice of the disability services community is loud and heard, and that from the ground up it is embedded,
              respected, and practised in every viewpoint.
            </p>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-pink-800 to-red-800 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6">
            <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
              🚀 Join the Movement
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Be Part of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              This Movement?
            </span>
          </h2>

          <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Join the movement reshaping what disability support can be — bold, honest, and rebuilt through
            the power of lived experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              to="/subscription"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/50"
            >
              <span className="relative z-10 flex items-center">
                Join Us Today
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              Get in Touch
            </Link>
          </div>

          <p className="text-lg text-gray-300 italic">
            Because this is not just a platform. It is a collective force reimagining a stronger, fairer,
            and more human disability system — one built by the community, for the community.
          </p>
        </div>
      </section>

      {/* Inline Styles for Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;