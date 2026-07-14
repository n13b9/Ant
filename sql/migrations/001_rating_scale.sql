-- Moves feedback.rating from text ('good'/'poor') to a 4-point smallint scale
-- (1=Poor 2=Okay 3=Good 4=Excellent). Existing rows are remapped: good -> 3, poor -> 1.

alter table feedback add column rating_new smallint;

update feedback set rating_new = case rating
  when 'good' then 3
  when 'poor' then 1
end;

alter table feedback alter column rating_new set not null;
alter table feedback drop column rating;
alter table feedback rename column rating_new to rating;
alter table feedback add constraint feedback_rating_check check (rating between 1 and 4);
