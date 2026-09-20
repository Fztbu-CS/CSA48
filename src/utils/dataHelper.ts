import type { Person, ShameIncident, PersonStats, CategoryType } from '../data/types';
import rawData from '../data/shameData.json';

export function getInitialData(): { persons: Person[]; incidents: ShameIncident[] } {
  return rawData as { persons: Person[]; incidents: ShameIncident[] };
}

export function computePersonStats(
  persons: Person[],
  incidents: ShameIncident[]
): {
  rankedPersons: PersonStats[];
  totalIncidents: number;
  categoryCounts: Record<CategoryType, number>;
  topOffender: PersonStats | null;
  avgSeverity: number;
} {
  const incidentMap = new Map<string, ShameIncident[]>();
  for (const p of persons) {
    incidentMap.set(p.id, []);
  }

  const categoryCounts: Record<CategoryType, number> = {
    code: 0,
    social: 0,
    words: 0,
    work: 0,
    life: 0,
  };

  let totalSeverity = 0;

  for (const inc of incidents) {
    if (incidentMap.has(inc.personId)) {
      incidentMap.get(inc.personId)!.push(inc);
    }
    if (categoryCounts[inc.category] !== undefined) {
      categoryCounts[inc.category]++;
    }
    totalSeverity += inc.severity;
  }

  const rankedPersons: PersonStats[] = persons.map((person) => {
    const pIncidents = incidentMap.get(person.id) || [];
    // Sort incidents by date desc
    const sortedIncidents = [...pIncidents].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const totalCount = sortedIncidents.length;
    const shameScore = sortedIncidents.reduce((sum, item) => sum + item.severity * 10, 0);
    const maxSeverity = sortedIncidents.reduce((max, item) => Math.max(max, item.severity), 0);
    const recentDate = sortedIncidents[0]?.date || person.joinedAt;

    return {
      ...person,
      totalCount,
      shameScore: totalCount, // 保持兼容，值为总次数
      maxSeverity,
      recentDate,
      incidents: sortedIncidents,
    };
  });

  // 纯按犯蠢总次数排序，次数相同时按最近案发时间排
  rankedPersons.sort((a, b) => {
    if (b.totalCount !== a.totalCount) {
      return b.totalCount - a.totalCount;
    }
    return new Date(b.recentDate).getTime() - new Date(a.recentDate).getTime();
  });

  // Assign ranks
  rankedPersons.forEach((p, idx) => {
    p.rank = idx + 1;
  });

  return {
    rankedPersons,
    totalIncidents: incidents.length,
    categoryCounts,
    topOffender: rankedPersons[0] || null,
    avgSeverity: incidents.length > 0 ? Number((totalSeverity / incidents.length).toFixed(1)) : 0,
  };
}
