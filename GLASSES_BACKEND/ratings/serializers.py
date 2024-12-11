from rest_framework import serializers
from .models import Rating


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")
        extra_kwargs = {
            "book": {"write_only": True},
            "user": {"write_only": True},
        }

    def create(self, validated_data):
        book = validated_data.get("book")
        user = validated_data.get("user")
        return Rating.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.score = validated_data.get("score", instance.score)
        instance.review = validated_data.get("review", instance.review)
        instance.save()
        return instance


class UserRatingSerializer(serializers.ModelSerializer):
    user_rating = serializers.FloatField(
        source="score", read_only=True
    )  # Renaming score to user_rating
    review = serializers.CharField(read_only=True)

    class Meta:
        model = Rating
        fields = ["user_rating", "review"]
