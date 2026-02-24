export function entriesToMarkdown({ entries, type }: any) {
  if (!entries?.length) return ""

  return (
    `## ${type}\n\n` +
    entries
      .map((entry: any) => {
        const dateRange = entry.current
          ? `${entry.startDate} - Present`
          : `${entry.startDate} - ${entry.endDate}`;
        return `### ${entry.title} @ ${entry.organization}\n${dateRange}\n\n${entry.description}`;
      })
      .join("\n\n")
  );
}

export function certificationsToMarkdown(certifications: any[]) {
  if (!certifications?.length) return "";
  return (
    `## Certifications\n\n` +
    certifications
      .map((cert: any) => {
        let line = `- **${cert.name}** — ${cert.organization}`;
        if (cert.date) line += ` (${cert.date})`;
        if (cert.credentialId) line += ` | Credential: ${cert.credentialId}`;
        return line;
      })
      .join("\n")
  );
}