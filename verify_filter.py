from bs4 import BeautifulSoup  
from datetime import datetime

def extract_observation_dates(file_path):
    with open(file_path, encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    result = {}

    for li in soup.find_all('li', class_='BirdList-list-list-item'):
        time_tag = li.find('time')
        if time_tag and time_tag.has_attr('datetime'):
            is_exotic = li.find('svg', class_='Icon--exoticEscapee') is not None
            if is_exotic:
                continue
            ebird_name = li.get('id')
            observer_div = li.find('div', class_='Obs-observer')
            birder_tag = observer_div.select_one('span:not(.is-visuallyHidden), a')  
            birder = birder_tag.get_text(strip=True) if birder_tag else None
            has_pictures = li.find('svg', class_='Icon--photo') is not None
            result[ebird_name] = dict(
                last_seen=datetime.strptime(time_tag['datetime'], '%Y-%m-%d %H:%M'),
                birder=birder, 
                has_pictures=has_pictures)

    return result


def extract_species_counts(file_path, azuay_data):
    with open(file_path, encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    species_map = {}

    for li in soup.find_all('li', id=lambda x: x and x.endswith('_out')):
        name_div = li.find('div', class_='snam')
        lim_span = li.find('span', class_='lim')
        input_span = li.find('input', class_='lim')
        
        if name_div and (lim_span or input_span):
            name = name_div.get_text(strip=True)
            if '(' in name:
                # No info for subspecies
                continue
            if lim_span:
            	value = lim_span.get_text(strip=True)
            else:
            	value = input_span.get('value')
            ebird_name = li.get('id').replace('_out', '')
            if ebird_name in azuay_data:
            	species_map[name] = azuay_data[ebird_name]
            else:
                species_map[name] = dict()
            species_map[name]['value'] = int(value)

    return species_map
    
 


azuay_data = extract_observation_dates('azuay_list.html')
azuay_counts = extract_species_counts('azuay_filter.html', azuay_data)

sorted_data = dict(sorted(
    azuay_counts.items(),
    key=lambda item: item[1].get('last_seen', datetime.min),
    reverse=True
))

for name, info in sorted_data.items():
    if info['value'] == 0 and 'last_seen' in info:
        print(f"{name}: {info}")
    elif info['value'] > 0 and 'last_seen' not in info:
        print(f"{name}: {info}")
