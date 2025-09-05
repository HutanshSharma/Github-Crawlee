import {Star , Computer, Flame,UserRoundCheck,UsersRound,} from "lucide-react"

const ProfileStats = ({ profile }) => {
  const stats = [
    {
      label: 'Followers',
      value: profile.followers,
      icon: UsersRound,
      color: 'text-primary',
      description: 'GitHub followers'
    },
    {
      label: 'Following',
      value: profile.following,
      icon: UserRoundCheck,
      color: 'text-secondary',
      description: 'Following users'
    },
    {
      label: 'Latest Stars',
      value: profile.repos_list.reduce((acc, repo) => {
        const stars = typeof repo.stars === 'number' ? repo.stars : 0;
        return acc + stars;
      }, 0),
      icon: Star,
      color: 'text-yellow-400',
      description: 'Stars received'
    },
    {
      label: 'Languages',
      value: new Set(profile.repos_list.map(repo => repo.most_used_language).filter(lang => lang && lang !== 'N/A')).size,
      icon: Computer,
      color: 'text-purple-400',
      description: 'Programming languages'
    },
    {
      label: 'Recent Activity',
      value: profile.repos_list.filter(repo => {
        const updatedDate = new Date(repo.updated_at);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return updatedDate > thirtyDaysAgo;
      }).length,
      icon: Flame,
      color: 'text-orange-400',
      description: 'Updated in 30 days'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="glass-morphism rounded-xl p-4 flex flex-col items-center card-hover">
          <div className="text-2xl mb-2"><stat.icon className={`${stat.color}`}/></div>
          <div className={`text-2xl font-bold ${stat.color} mb-1`}>
            {stat.value}
          </div>
          <div className="text-white text-sm font-medium mb-1">{stat.label}</div>
          <div className="text-gray-400 text-xs">{stat.description}</div>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;