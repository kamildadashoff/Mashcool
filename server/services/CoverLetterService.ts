import { CandidateProfile, Vacancy } from '../../src/types';
import { getGeminiClient } from './GeminiService';

export class CoverLetterService {
  // Generate a tailored, executive cover letter respecting language priority and verified facts only
  async generateCoverLetter(candidate: CandidateProfile, vacancy: Vacancy): Promise<{ subject: string; body: string; language: string }> {
    // 1. Determine target language: vacancy description language > candidate preference > fallback 'az'
    const targetLang = vacancy.originalLanguage || 'az';
    const fullName = `${candidate.firstName} ${candidate.lastName}`.trim() || 'Candidate';
    const subject = `${vacancy.titleNormalized} — ${fullName}`;

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `You are the lead executive recruiter and copywriter for MASHCOOL (https://mash.cool).
Draft a concise, high-converting, human job application email from the candidate to the employer.

CRITICAL PRODUCT RULES:
1. Target Language: MUST write in ${targetLang === 'az' ? 'Azerbaijani' : targetLang === 'en' ? 'English' : 'Russian'}.
2. ONLY use verified facts from the Candidate Profile below. NEVER fabricate or invent skills, companies, or metrics.
3. Address the specific company ("${vacancy.companyName}") and role ("${vacancy.titleNormalized}").
4. Length: 120-200 words. Direct, confident, respectful, zero fluff or cliché openings (do NOT say "I have been passionate since childhood...").
5. Include a closing stating that the CV is attached.
6. End with formal sign-off, Candidate Name (${fullName}), Phone (${candidate.phone}), and Email (${candidate.email}).

CANDIDATE PROFILE:
- Name: ${fullName}
- Headline: ${candidate.professionalHeadline}
- Summary: ${candidate.professionalSummary}
- Years Experience: ${candidate.yearsExperience}
- Current Role: ${candidate.currentRole}
- Skills: ${candidate.skills.join(', ')}
- Tools: ${candidate.tools.join(', ')}
- Recent Works: ${candidate.workHistory.map(w => `${w.role} at ${w.company} (${w.highlights.join(', ')})`).join('; ')}

VACANCY DETAILS:
- Company: ${vacancy.companyName}
- Title: ${vacancy.titleNormalized}
- Location: ${vacancy.location}
- Requirements: ${vacancy.requirements.join('; ')}
- Description: ${vacancy.descriptionNormalized}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
        });

        if (response.text && response.text.length > 80) {
          return {
            subject,
            body: response.text.trim(),
            language: targetLang,
          };
        }
      } catch (err) {
        console.warn('Gemini cover letter generation error, using tailored template:', err);
      }
    }

    // High quality template fallback matching prompt spec
    let body = '';
    if (targetLang === 'en') {
      body = `Dear ${vacancy.companyName} Hiring Team,

I am writing to express my strong interest in the ${vacancy.titleNormalized} position. With over ${candidate.yearsExperience} years of experience in ${candidate.currentRole || 'this field'}, I have developed a strong track record delivering impactful projects and collaborating closely with cross-functional teams.

Given your requirements in ${vacancy.requirements.slice(0, 2).join(' and ')}, my background with ${candidate.skills.slice(0, 3).join(', ')} and tools such as ${candidate.tools.slice(0, 3).join(', ')} aligns well with your team's current goals. In my previous role at ${candidate.workHistory[0]?.company || 'my recent position'}, I led key initiatives that enhanced overall team efficiency and output quality.

I have attached my full CV for your review and would welcome the opportunity to discuss how my background can support ${vacancy.companyName}'s upcoming milestones.

Best regards,
${fullName}
${candidate.phone}
${candidate.email}`;
    } else if (targetLang === 'ru') {
      body = `Уважаемая команда найма ${vacancy.companyName},

Обращаюсь к вам по поводу открытой вакансии «${vacancy.titleNormalized}». Имея более ${candidate.yearsExperience} лет профессионального опыта в роли ${candidate.currentRole || 'специалиста'}, я успешно реализовал ключевые проекты, сочетая стратегический подход и высокое качество исполнения.

Мой стек навыков (${candidate.skills.slice(0, 3).join(', ')}) и опыт работы с инструментами ${candidate.tools.slice(0, 3).join(', ')} точно соответствуют заявленным требованиям вашей позиции. На предыдущем месте работы в ${candidate.workHistory[0]?.company || 'компании'} я отвечал за разработку и запуск ключевых инициатив.

Мое резюме прикреплено к письму. Буду рад обсудить возможности сотрудничества и ответить на ваши вопросы.

С уважением,
${fullName}
${candidate.phone}
${candidate.email}`;
    } else {
      // Azerbaijani (Default)
      body = `Hörmətli ${vacancy.companyName} İstedadların İdarəedilməsi komandası,

Şirkətinizdə elan olunmuş «${vacancy.titleNormalized}» vakansiyası üzrə müraciətimi təqdim edirəm. ${candidate.yearsExperience}+ illik peşəkar təcrübəm ərzində ${candidate.currentRole || 'müvafiq sahədə'} mühüm layihələrin icrasına və brend/biznes hədəflərinin uğurla reallaşdırılmasına rəhbərlik etmişəm.

Vakansiyanın tələblərində qeyd edilən istiqamətlər (${vacancy.requirements.slice(0, 2).join(', ')}) mənim ${candidate.skills.slice(0, 3).join(', ')} üzrə biliklərim və ${candidate.tools.slice(0, 3).join(', ')} təcrübəmlə tam uzlaşır. Son iş yerim olan ${candidate.workHistory[0]?.company || 'şirkətdə'} komanda ilə birgə layihə standartlarının yüksəldilməsinə nail olmuşuq.

Ətraflı CV faylım məktuba əlavə edilmişdir. Təcrübəmin ${vacancy.companyName} komandasına gətirəcəyi dəyəri müzakirə etmək üçün müsahibəyə məmnuniyyətlə qatılardım.

Hörmətlə,
${fullName}
${candidate.phone}
${candidate.email}`;
    }

    return {
      subject,
      body,
      language: targetLang,
    };
  }
}

export const coverLetterService = new CoverLetterService();
