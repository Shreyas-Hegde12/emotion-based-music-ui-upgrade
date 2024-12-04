from constants import HAPPY,SAD,ANGER,SURPRISE,CALM

e1, e2, e3, e4, e5 = 0,0,0,0,0
select_group = {
        'starter':['lover diljit'],
        'happy': HAPPY,
        'sad':SAD,
        'angry': ANGER,
        'surprised':SURPRISE,
        'neutral':CALM
    }
group_count = {
        'starter':1,
        'happy': e1,
        'sad':e2,
        'angry': e3,
        'surprised':e4,
        'neutral':e5
    }

def emotion_query(emotion):
    if (group_count[emotion]== len(select_group[emotion])):
        group_count[emotion] = 0
    
    no = group_count[emotion]

    search_query = select_group[emotion][no]

    group_count[emotion] += 1

    return search_query

